import random
from typing import List

from app.providers.base import AIProvider, AIResponse
from app.schemas.chat import SourceRef


class MockProvider(AIProvider):
    def __init__(self):
        self.responses = {
            "download": {
                "answer": "To download your hall ticket, follow the official process announced by the SNJB Examination Cell. Visit the official portal URL from the latest notice, log in with your PRN/seat number and password, navigate to the Hall Ticket section, verify your details, and download. Print at least two copies. The exact portal URL and release date are in the official notice.",
                "follow_up": ["What if I cannot log in?", "When will hall tickets be released?", "What documents do I need?"]
            },
            "troubleshooting": {
                "answer": "If your hall ticket is unavailable, first check the official release notice to confirm tickets are released for your exam. Verify your examination form was submitted and fees paid. Clear browser cache or try a different browser. If the issue persists, contact the Examination Cell at principalcoe@snjb.org or +91 2556 253750. Do not share your login credentials.",
                "follow_up": ["How do I check my examination form status?", "What if my details are wrong?", "Can someone else collect my hall ticket?"]
            },
            "checklist": {
                "answer": "Exam day checklist: Hall ticket (printed, 2 copies), valid photo ID (Aadhar/PAN/Driving License/College ID), exam centre location confirmed, arrive 30+ minutes early, blue/black pens, pencils, eraser, calculator if permitted, transparent water bottle. No phones, smartwatches, or unauthorised materials. Confirm specifics with your official notice.",
                "follow_up": ["What if I lose my hall ticket on exam day?", "Are calculators allowed for all subjects?", "What is the dress code?"]
            },
            "official-help": {
                "answer": "SNJB Examination Cell / COE Desk: Email principalcoe@snjb.org, Phone +91 2556 253750. Office at SNJB College of Engineering. Website: https://snjb.org/engineering/exam-cell/coe-desk. Typical hours Mon-Fri 10 AM - 5 PM (confirm current hours). Keep your PRN/seat number ready when contacting.",
                "follow_up": ["What is the process for correcting my name?", "How do I report a grievance?", "What are the office hours?"]
            },
            "corrections": {
                "answer": "For corrections (name, photo, subjects), contact the Examination Cell immediately. Submit a written application with supporting documents (Aadhar, marksheet) before the published deadline. Check the latest official notice for the current procedure. Contact: principalcoe@snjb.org or +91 2556 253750.",
                "follow_up": ["What documents are needed for name correction?", "What is the correction deadline?", "Can I correct my exam centre?"]
            },
            "general": {
                "answer": "I can help with hall ticket procedures, examination processes, and common issues. Try asking about downloading hall tickets, troubleshooting unavailable tickets, exam day checklist, or contacting the examination office.",
                "follow_up": ["How do I download my hall ticket?", "My hall ticket is unavailable", "What documents do I need?", "How do I contact the examination office?"]
            }
        }

    async def generate_answer(
        self,
        question: str,
        context_faqs: List[str],
        context_procedures: List[str],
        sources: List[SourceRef],
    ) -> AIResponse:
        question_lower = question.lower()

        if any(kw in question_lower for kw in ["download", "get", "portal", "link", "access", "print"]):
            category = "download"
        elif any(kw in question_lower for kw in ["unavailable", "issue", "problem", "fix", "cannot", "not working", "missing", "error"]):
            category = "troubleshooting"
        elif any(kw in question_lower for kw in ["checklist", "document", "prepare", "exam day", "need", "bring", "carry"]):
            category = "checklist"
        elif any(kw in question_lower for kw in ["contact", "help", "office", "phone", "email", "address"]):
            category = "official-help"
        elif any(kw in question_lower for kw in ["correct", "wrong", "change", "update", "name", "photo", "subject"]):
            category = "corrections"
        else:
            category = "general"

        resp = self.responses.get(category, self.responses["general"])

        evidence_status = "supported" if sources else "insufficient_evidence"

        return AIResponse(
            answer=resp["answer"],
            evidence_status=evidence_status,
            sources=sources,
            follow_up_suggestions=resp["follow_up"]
        )

    def get_model_name(self) -> str:
        return "mock-provider-v1"