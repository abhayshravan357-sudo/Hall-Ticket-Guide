from typing import List, Optional
from dataclasses import dataclass

from app.knowledge.loader import KnowledgeBase, FAQ, Source, Procedure
from app.services.intent_router import IntentResult, classify_intent, get_relevant_faqs, get_relevant_procedures


@dataclass
class RetrievalResult:
    faqs: List[FAQ]
    sources: List[Source]
    procedures: List[Procedure]
    intent: IntentResult
    has_approved_evidence: bool


def retrieve_evidence(kb: KnowledgeBase, query: str, max_faqs: int = 5, max_procedures: int = 2) -> RetrievalResult:
    intent = classify_intent(query)

    all_faqs = kb.get_all_faqs()
    relevant_faqs = get_relevant_faqs(all_faqs, intent, query, max_faqs)

    all_procedures = kb.get_procedures()
    relevant_procedures = get_relevant_procedures(all_procedures, intent, max_procedures)

    source_ids = set()
    for faq in relevant_faqs:
        source_ids.update(faq.source_ids)
    for proc in relevant_procedures:
        source_ids.update(proc.source_ids)

    sources = [kb.get_source(sid) for sid in source_ids if kb.get_source(sid)]

    has_approved = any(faq.is_approved for faq in relevant_faqs) or any(proc.is_approved for proc in relevant_procedures)

    return RetrievalResult(
        faqs=relevant_faqs,
        sources=sources,
        procedures=relevant_procedures,
        intent=intent,
        has_approved_evidence=has_approved
    )