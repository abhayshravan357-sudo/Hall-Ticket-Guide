from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.config import get_settings
from app.knowledge.loader import get_knowledge_base, reload_knowledge_base
from app.knowledge.validator import validate_knowledge_base, check_unverified_data
from app.api import chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    kb = get_knowledge_base()
    
    validation_errors = validate_knowledge_base(kb)
    unverified_warnings = check_unverified_data(kb)
    
    print("=== Knowledge Base Validation ===")
    for category, errors in validation_errors.items():
        if errors:
            print(f"ERRORS in {category}:")
            for err in errors:
                print(f"  - {err}")
    
    print("\n=== Unverified Data Warnings ===")
    for category, warnings in unverified_warnings.items():
        if warnings:
            print(f"{category}:")
            for warn in warnings:
                print(f"  - {warn}")
    
    print(f"\nKnowledge Base loaded: {len(kb.faqs)} FAQs, {len(kb.sources)} sources, {len(kb.procedures)} procedures")
    print(f"AI Provider: {settings.ai_provider}")
    print(f"Environment: {settings.app_env}")
    
    yield
    
    print("Shutting down...")


settings = get_settings()

app = FastAPI(
    title="Hall Ticket Guide AI",
    description="API for SNJB Hall Ticket Guide AI Assistant",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1")


@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"error": {"code": "VALIDATION_ERROR", "message": "Invalid request data"}}
    )


@app.exception_handler(500)
async def internal_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}}
    )


@app.get("/")
async def root():
    return {
        "name": "Hall Ticket Guide AI",
        "version": "0.1.0",
        "description": "SNJB Student Help Centre API",
        "docs": "/docs"
    }