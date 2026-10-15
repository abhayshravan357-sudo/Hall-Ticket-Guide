import sys
sys.path.insert(0, "/home/abhaysawant/ai pratical/kunal/backend")

import pytest
from app.knowledge.loader import KnowledgeBase, get_knowledge_base
from app.knowledge.validator import validate_knowledge_base, check_unverified_data, validate_faq, validate_source
from app.services.intent_router import classify_intent, get_relevant_faqs
from app.services.retrieval import retrieve_evidence
from app.services.answer_service import AnswerService, create_answer_service
from app.providers.mock_provider import MockProvider


class TestKnowledgeBase:
    def test_load_knowledge_base(self):
        kb = get_knowledge_base()
        assert len(kb.faqs) > 0
        assert len(kb.sources) > 0
        assert len(kb.procedures) > 0

    def test_faq_structure(self):
        kb = get_knowledge_base()
        for faq in kb.faqs:
            assert faq.id
            assert faq.question
            assert faq.answer
            assert faq.category
            assert faq.status in ("draft", "approved", "retired")
            assert isinstance(faq.source_ids, list)
            assert isinstance(faq.applicability, dict)

    def test_source_structure(self):
        kb = get_knowledge_base()
        for source in kb.sources.values():
            assert source.id
            assert source.title
            assert source.url.startswith(("http://", "https://"))
            assert source.status in ("unverified", "verified", "deprecated")

    def test_procedure_structure(self):
        kb = get_knowledge_base()
        for proc in kb.procedures:
            assert proc.id
            assert proc.title
            assert proc.category
            assert proc.steps is None or isinstance(proc.steps, list)
            assert proc.status in ("draft", "approved", "retired")


class TestValidator:
    def test_validate_knowledge_base(self):
        kb = get_knowledge_base()
        errors = validate_knowledge_base(kb)
        assert isinstance(errors, dict)
        assert "faqs" in errors
        assert "sources" in errors
        assert "procedures" in errors

    def test_check_unverified_data(self):
        kb = get_knowledge_base()
        warnings = check_unverified_data(kb)
        assert isinstance(warnings, dict)
        assert "draft_faqs" in warnings
        assert "unverified_sources" in warnings
        assert "unapproved_procedures" in warnings

    def test_validate_faq_draft_status(self):
        kb = get_knowledge_base()
        for faq in kb.faqs:
            if faq.status == "draft":
                assert not faq.is_approved
            elif faq.status == "approved":
                assert faq.is_approved


class TestIntentRouter:
    def test_classify_download_intent(self):
        result = classify_intent("How do I download my hall ticket?")
        assert result.category == "download"
        assert result.confidence > 0

    def test_classify_troubleshooting_intent(self):
        result = classify_intent("My hall ticket is unavailable, what should I do?")
        assert result.category == "troubleshooting"
        assert result.confidence > 0

    def test_classify_checklist_intent(self):
        result = classify_intent("What documents do I need for the exam?")
        assert result.category == "checklist"
        assert result.confidence > 0

    def test_classify_help_intent(self):
        result = classify_intent("How do I contact the examination office?")
        assert result.category == "official-help"
        assert result.confidence > 0

    def test_classify_general_intent(self):
        result = classify_intent("Hello, how are you?")
        assert result.category == "general"
        assert result.confidence == 0.0

    def test_get_relevant_faqs(self):
        kb = get_knowledge_base()
        intent = classify_intent("How do I download my hall ticket?")
        faqs = get_relevant_faqs(kb.faqs, intent, "How do I download my hall ticket?")
        assert len(faqs) > 0
        assert any(f.category == "download" for f in faqs)


class TestRetrieval:
    def test_retrieve_evidence_download(self):
        kb = get_knowledge_base()
        result = retrieve_evidence(kb, "How do I download my hall ticket?")
        assert result.intent.category == "download"
        assert len(result.faqs) > 0
        assert len(result.sources) > 0

    def test_retrieve_evidence_troubleshooting(self):
        kb = get_knowledge_base()
        result = retrieve_evidence(kb, "My hall ticket is unavailable")
        assert result.intent.category == "troubleshooting"
        assert len(result.faqs) > 0

    def test_retrieve_evidence_insufficient(self):
        kb = get_knowledge_base()
        result = retrieve_evidence(kb, "What is the meaning of life?")
        assert result.intent.category == "general"


class TestAnswerService:
    @pytest.mark.asyncio
    async def test_mock_provider_answer(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        result = await service.generate_answer("How do I download my hall ticket?", "test-123")
        assert result.answer
        assert result.conversation_id == "test-123"
        assert result.evidence_status in ("supported", "insufficient_evidence", "conflicting_sources")
        assert isinstance(result.sources, list)
        assert isinstance(result.follow_up_suggestions, list)

    @pytest.mark.asyncio
    async def test_insufficient_evidence(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        result = await service.generate_answer("What is the meaning of life?", "test-456")
        assert result.evidence_status == "insufficient_evidence"
        assert "contact" in result.answer.lower() or "examination" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_different_categories(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        download_result = await service.generate_answer("How do I download my hall ticket?", "test-1")
        assert "download" in download_result.answer.lower() or "portal" in download_result.answer.lower()
        
        trouble_result = await service.generate_answer("My hall ticket is unavailable", "test-2")
        assert "unavailable" in trouble_result.answer.lower() or "issue" in trouble_result.answer.lower() or "contact" in trouble_result.answer.lower()
        
        checklist_result = await service.generate_answer("What documents do I need?", "test-3")
        assert "document" in checklist_result.answer.lower() or "hall ticket" in checklist_result.answer.lower() or "ID" in checklist_result.answer


class TestMockProvider:
    def test_mock_provider_model_name(self):
        provider = MockProvider()
        assert provider.get_model_name() == "mock-provider-v1"

    @pytest.mark.asyncio
    async def test_mock_provider_generate(self):
        provider = MockProvider()
        response = await provider.generate_answer(
            question="How do I download?",
            context_faqs=[],
            context_procedures=[],
            sources=[]
        )
        assert response.answer
        assert response.evidence_status in ("supported", "insufficient_evidence")
        assert isinstance(response.follow_up_suggestions, list)