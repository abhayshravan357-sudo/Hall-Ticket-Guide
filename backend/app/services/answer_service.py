from typing import List, Optional
from dataclasses import dataclass

from app.knowledge.loader import KnowledgeBase, FAQ, Procedure
from app.services.retrieval import RetrievalResult, retrieve_evidence
from app.providers.base import AIProvider, AIResponse
from app.providers.mock_provider import MockProvider
from app.schemas.chat import SourceRef
from app.config import get_settings


@dataclass
class AnswerResult:
    answer: str
    evidence_status: str
    sources: List[SourceRef]
    follow_up_suggestions: List[str]
    conversation_id: str


class AnswerService:
    def __init__(self, kb: KnowledgeBase, provider: Optional[AIProvider] = None):
        self.kb = kb
        self.provider = provider or MockProvider()
        self.settings = get_settings()

    async def generate_answer(
        self,
        question: str,
        conversation_id: str,
    ) -> AnswerResult:
        retrieval = retrieve_evidence(self.kb, question)

        source_refs = [
            SourceRef(id=s.id, title=s.title, url=s.url)
            for s in retrieval.sources
        ]

        context_faqs = [f"Q: {faq.question}\nA: {faq.answer}" for faq in retrieval.faqs]
        context_procedures = [f"{proc.title}: {'; '.join(proc.steps)}" for proc in retrieval.procedures]

        if not retrieval.faqs and not retrieval.procedures:
            return AnswerResult(
                answer="I don't have enough verified information to answer that question. Please check the official SNJB Examination Cell website or contact them directly at principalcoe@snjb.org / +91 2556 253750.",
                evidence_status="insufficient_evidence",
                sources=source_refs,
                follow_up_suggestions=[
                    "How do I contact the examination office?",
                    "Where can I find official notices?",
                    "What is the examination cell website?"
                ],
                conversation_id=conversation_id
            )

        evidence_status = "supported" if retrieval.has_approved_evidence else "insufficient_evidence"

        ai_response = await self.provider.generate_answer(
            question=question,
            context_faqs=context_faqs,
            context_procedures=context_procedures,
            sources=source_refs,
        )

        return AnswerResult(
            answer=ai_response.answer,
            evidence_status=evidence_status,
            sources=ai_response.sources,
            follow_up_suggestions=ai_response.follow_up_suggestions,
            conversation_id=conversation_id
        )


def create_answer_service(kb: KnowledgeBase) -> AnswerService:
    settings = get_settings()
    provider = MockProvider()
    return AnswerService(kb, provider)