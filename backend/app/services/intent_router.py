from typing import Literal, List
from dataclasses import dataclass

from app.knowledge.loader import FAQ, Procedure


@dataclass
class IntentResult:
    category: str
    confidence: float
    matched_keywords: List[str]


CATEGORY_KEYWORDS = {
    "download": ["download", "get", "obtain", "portal", "link", "url", "access", "print"],
    "troubleshooting": ["unavailable", "not available", "issue", "problem", "fix", "troubleshoot", "error", "cannot", "can't", "won't", "not working", "broken", "missing"],
    "checklist": ["checklist", "document", "prepare", "exam day", "what do i need", "requirement", "bring", "carry"],
    "official-help": ["contact", "help", "office", "phone", "email", "address", "where", "who"],
    "corrections": ["correct", "wrong", "error", "mistake", "change", "update", "name", "photo", "subject"],
    "fees": ["fee", "payment", "pay", "cost", "amount", "due", "unpaid"],
    "rules": ["rule", "regulation", "policy", "allowed", "permitted", "prohibited", "dress code"],
    "timetable": ["timetable", "schedule", "date", "time", "when", "calendar"],
}


def classify_intent(message: str) -> IntentResult:
    message_lower = message.lower()
    scores = {}
    matched = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        matched_kw = []
        for kw in keywords:
            if kw in message_lower:
                score += 1
                matched_kw.append(kw)
        if score > 0:
            scores[category] = score
            matched[category] = matched_kw

    if not scores:
        return IntentResult(category="general", confidence=0.0, matched_keywords=[])

    best_category = max(scores, key=scores.get)
    max_score = scores[best_category]
    total_possible = len(CATEGORY_KEYWORDS[best_category])
    confidence = min(max_score / max(total_possible, 1), 1.0)

    return IntentResult(
        category=best_category,
        confidence=confidence,
        matched_keywords=matched.get(best_category, [])
    )


def get_relevant_faqs(faqs: List[FAQ], intent: IntentResult, query: str, limit: int = 5) -> List[FAQ]:
    if intent.category == "general":
        return faqs[:limit]

    category_faqs = [f for f in faqs if f.category == intent.category]
    other_faqs = [f for f in faqs if f.category != intent.category]

    query_words = set(query.lower().split())
    scored = []

    for faq in category_faqs:
        score = 0
        faq_words = set(faq.question.lower().split()) | set(faq.answer.lower().split())
        overlap = query_words & faq_words
        score += len(overlap) * 2
        for kw in intent.matched_keywords:
            if kw in faq.question.lower() or kw in faq.answer.lower():
                score += 3
        if score > 0:
            scored.append((score, faq))

    for faq in other_faqs:
        score = 0
        faq_words = set(faq.question.lower().split()) | set(faq.answer.lower().split())
        overlap = query_words & faq_words
        score += len(overlap)
        if score > 0:
            scored.append((score, faq))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [faq for _, faq in scored[:limit]]


def get_relevant_procedures(procedures: List[Procedure], intent: IntentResult, limit: int = 2) -> List[Procedure]:
    if intent.category == "general":
        return procedures[:limit]

    category_procs = [p for p in procedures if p.category == intent.category]
    other_procs = [p for p in procedures if p.category != intent.category]

    return category_procs[:limit] + other_procs[:max(0, limit - len(category_procs))]