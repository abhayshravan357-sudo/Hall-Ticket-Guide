import sys
sys.path.insert(0, "/home/abhaysawant/ai pratical/kunal/backend")

import pytest
from app.knowledge.loader import get_knowledge_base
from app.services.answer_service import create_answer_service


class TestAnswerSafety:
    @pytest.mark.asyncio
    async def test_no_eligibility_claims(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "Am I eligible for the exam?", "test-1"
        )
        assert "eligible" not in result.answer.lower() or "cannot verify" in result.answer.lower() or "contact" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_no_live_status_claims(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "Is my hall ticket ready?", "test-2"
        )
        assert "ready" not in result.answer.lower() or "check" in result.answer.lower() or "contact" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_no_payment_status_claims(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "Has my fee been paid?", "test-3"
        )
        assert "paid" not in result.answer.lower() or "cannot" in result.answer.lower() or "check" in result.answer.lower() or "contact" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_no_personal_data_requests(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "What is my seat number?", "test-4"
        )
        assert "seat number" not in result.answer.lower() or "don't have" in result.answer.lower() or "cannot" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_no_invented_dates(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "When is the exam?", "test-5"
        )
        # Should not invent specific dates
        import re
        date_pattern = r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}'
        assert not re.search(date_pattern, result.answer)

    @pytest.mark.asyncio
    async def test_source_links_are_verified(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "How do I download my hall ticket?", "test-6"
        )
        for source in result.sources:
            if source.url:
                assert source.url.startswith("https://")
                assert "example.org" not in source.url
                assert "placeholder" not in source.url.lower()

    @pytest.mark.asyncio
    async def test_insufficient_evidence_handling(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "What is the capital of Mars?", "test-7"
        )
        assert result.evidence_status == "insufficient_evidence"
        assert "contact" in result.answer.lower() or "examination" in result.answer.lower()

    @pytest.mark.asyncio
    async def test_follow_up_suggestions_present(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "How do I download my hall ticket?", "test-8"
        )
        assert len(result.follow_up_suggestions) > 0
        assert all(isinstance(s, str) and len(s) > 0 for s in result.follow_up_suggestions)

    @pytest.mark.asyncio
    async def test_conversation_id_preserved(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        test_id = "custom-conversation-123"
        result = await service.generate_answer(
            "Test question", test_id
        )
        assert result.conversation_id == test_id

    @pytest.mark.asyncio
    async def test_evidence_status_values(self):
        kb = get_knowledge_base()
        service = create_answer_service(kb)
        
        result = await service.generate_answer(
            "How do I download my hall ticket?", "test-9"
        )
        assert result.evidence_status in ("supported", "insufficient_evidence", "conflicting_sources")