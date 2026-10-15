from abc import ABC, abstractmethod
from typing import List, Optional
from dataclasses import dataclass

from app.schemas.chat import SourceRef


@dataclass
class AIResponse:
    answer: str
    evidence_status: str
    sources: List[SourceRef]
    follow_up_suggestions: List[str]


class AIProvider(ABC):
    @abstractmethod
    async def generate_answer(
        self,
        question: str,
        context_faqs: List[str],
        context_procedures: List[str],
        sources: List[SourceRef],
    ) -> AIResponse:
        pass

    @abstractmethod
    def get_model_name(self) -> str:
        pass