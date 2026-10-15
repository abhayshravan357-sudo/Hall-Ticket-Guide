from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class SourceRef(BaseModel):
    id: str
    title: str
    url: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    answer: str
    evidence_status: Literal["supported", "insufficient_evidence", "conflicting_sources"]
    sources: List[SourceRef] = []
    follow_up_suggestions: List[str] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    status: str
    ai_provider: str
    knowledge_base: str


class ResourceItem(BaseModel):
    id: str
    title: str
    url: str
    category: str


class ResourcesResponse(BaseModel):
    resources: List[ResourceItem]


class FeedbackRequest(BaseModel):
    conversation_id: str
    rating: Literal["helpful", "not_helpful"]
    reason: Optional[str] = None


class FeedbackResponse(BaseModel):
    success: bool
    message: str


class ChecklistItem(BaseModel):
    id: int
    text: str
    required: bool


class ChecklistResponse(BaseModel):
    items: List[ChecklistItem]
    notes: str
    source_ids: List[str] = []


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail