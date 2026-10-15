from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import List
import uuid
import time
from collections import defaultdict

from app.schemas.chat import (
    ChatRequest, ChatResponse, HealthResponse,
    ResourcesResponse, ResourceItem,
    FeedbackRequest, FeedbackResponse,
    ChecklistResponse, ChecklistItem,
    ErrorResponse, ErrorDetail
)
from app.services.answer_service import AnswerService, create_answer_service
from app.knowledge.loader import get_knowledge_base


router = APIRouter()


rate_limit_store = defaultdict(list)


def check_rate_limit(request: Request, limit: int = 10) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    minute_ago = now - 60

    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if t > minute_ago]

    if len(rate_limit_store[client_ip]) >= limit:
        raise HTTPException(
            status_code=429,
            detail={"code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests. Please wait a moment."}
        )

    rate_limit_store[client_ip].append(now)


def get_answer_service() -> AnswerService:
    kb = get_knowledge_base()
    return create_answer_service(kb)


@router.get("/health", response_model=HealthResponse)
async def health_check():
    kb = get_knowledge_base()
    return HealthResponse(
        status="ok",
        ai_provider="mock",
        knowledge_base="loaded" if kb.faqs else "empty"
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
    answer_service: AnswerService = Depends(get_answer_service)
):
    check_rate_limit(request, limit=10)

    if len(chat_request.message) > 2000:
        raise HTTPException(
            status_code=422,
            detail={"code": "MESSAGE_TOO_LONG", "message": "Message exceeds maximum length of 2000 characters"}
        )

    conversation_id = chat_request.conversation_id or str(uuid.uuid4())

    result = await answer_service.generate_answer(
        question=chat_request.message,
        conversation_id=conversation_id
    )

    return ChatResponse(
        conversation_id=result.conversation_id,
        answer=result.answer,
        evidence_status=result.evidence_status,
        sources=result.sources,
        follow_up_suggestions=result.follow_up_suggestions
    )


@router.get("/resources", response_model=ResourcesResponse)
async def get_resources():
    resources = [
        ResourceItem(
            id="exam-cell",
            title="SNJB Examination Cell / COE Desk",
            url="https://snjb.org/engineering/exam-cell/coe-desk",
            category="official-help"
        )
    ]
    return ResourcesResponse(resources=resources)


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackRequest):
    return FeedbackResponse(
        success=True,
        message="Thank you for your feedback"
    )


@router.get("/checklist", response_model=ChecklistResponse)
async def get_checklist():
    kb = get_knowledge_base()
    procedures = kb.get_procedures("checklist")

    if procedures:
        proc = procedures[0]
        items = [
            ChecklistItem(id=i+1, text=step, required=True)
            for i, step in enumerate(proc.items) if isinstance(proc.items[0], dict)
        ] if proc.items and isinstance(proc.items[0], dict) else [
            ChecklistItem(id=i+1, text=step, required=True)
            for i, step in enumerate(proc.steps)
        ]
        notes = proc.notes
        source_ids = proc.source_ids
    else:
        items = [
            ChecklistItem(id=1, text="Hall ticket downloaded and printed (two copies recommended)", required=True),
            ChecklistItem(id=2, text="Valid photo ID (Aadhar, PAN, driving license, or college ID)", required=True),
            ChecklistItem(id=3, text="Exam centre location and route confirmed", required=True),
            ChecklistItem(id=4, text="Reporting time noted (arrive at least 30 minutes early)", required=True),
            ChecklistItem(id=5, text="Permitted stationery: pens (blue/black), pencils, eraser, sharpener", required=True),
            ChecklistItem(id=6, text="Calculator (if permitted for your subject) — check subject rules", required=False),
            ChecklistItem(id=7, text="Water bottle (transparent, no labels)", required=False),
            ChecklistItem(id=8, text="No electronic devices, smartwatches, or unauthorised materials", required=True),
        ]
        notes = "General guidance — confirm specific requirements with your examination notice."
        source_ids = ["source-001"]

    return ChecklistResponse(
        items=items,
        notes=notes,
        source_ids=source_ids
    )