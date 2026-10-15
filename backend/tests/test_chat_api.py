import sys
sys.path.insert(0, "/home/abhaysawant/ai pratical/kunal/backend")

import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


class TestHealthEndpoint:
    def test_health_check(self):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "ai_provider" in data
        assert "knowledge_base" in data


class TestChatEndpoint:
    def test_valid_chat_request(self):
        response = client.post("/api/v1/chat", json={
            "message": "How do I download my hall ticket?",
            "conversation_id": "test-123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["conversation_id"] == "test-123"
        assert "answer" in data
        assert "evidence_status" in data
        assert "sources" in data
        assert "follow_up_suggestions" in data

    def test_chat_without_conversation_id(self):
        response = client.post("/api/v1/chat", json={
            "message": "How do I download my hall ticket?"
        })
        assert response.status_code == 200
        data = response.json()
        assert "conversation_id" in data
        assert len(data["conversation_id"]) > 0

    def test_empty_message_rejected(self):
        response = client.post("/api/v1/chat", json={
            "message": ""
        })
        assert response.status_code == 422

    def test_oversized_message_rejected(self):
        response = client.post("/api/v1/chat", json={
            "message": "x" * 2001
        })
        assert response.status_code == 422

    def test_missing_message_rejected(self):
        response = client.post("/api/v1/chat", json={})
        assert response.status_code == 422

    def test_troubleshooting_question(self):
        response = client.post("/api/v1/chat", json={
            "message": "My hall ticket is unavailable"
        })
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert len(data["answer"]) > 0

    def test_checklist_question(self):
        response = client.post("/api/v1/chat", json={
            "message": "What documents do I need for the exam?"
        })
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data

    def test_help_question(self):
        response = client.post("/api/v1/chat", json={
            "message": "How do I contact the examination office?"
        })
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data


class TestResourcesEndpoint:
    def test_get_resources(self):
        response = client.get("/api/v1/resources")
        assert response.status_code == 200
        data = response.json()
        assert "resources" in data
        assert isinstance(data["resources"], list)
        assert len(data["resources"]) > 0
        resource = data["resources"][0]
        assert "id" in resource
        assert "title" in resource
        assert "url" in resource
        assert "category" in resource


class TestFeedbackEndpoint:
    def test_submit_feedback(self):
        response = client.post("/api/v1/feedback", json={
            "conversation_id": "test-123",
            "rating": "helpful",
            "reason": "Good answer"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "message" in data


class TestChecklistEndpoint:
    def test_get_checklist(self):
        response = client.get("/api/v1/checklist")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "notes" in data
        assert "source_ids" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) > 0
        item = data["items"][0]
        assert "id" in item
        assert "text" in item
        assert "required" in item


class TestRateLimiting:
    def test_rate_limit_enforced(self):
        for _ in range(15):
            response = client.post("/api/v1/chat", json={
                "message": "Test message"
            })
        assert response.status_code == 429
        data = response.json()
        assert data["detail"]["code"] == "RATE_LIMIT_EXCEEDED"


class TestCORS:
    def test_cors_headers(self):
        response = client.options("/api/v1/health", headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        })
        assert response.status_code == 200