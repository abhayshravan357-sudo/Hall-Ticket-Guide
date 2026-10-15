import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class FAQ:
    id: str
    question: str
    answer: str
    category: str
    source_ids: List[str]
    status: str
    last_verified: Optional[str]
    applicability: Dict[str, Any]

    @property
    def is_approved(self) -> bool:
        return self.status == "approved"

    @property
    def is_draft(self) -> bool:
        return self.status == "draft"


@dataclass
class Source:
    id: str
    title: str
    url: str
    publisher: str
    published_at: Optional[str]
    retrieved_at: Optional[str]
    status: str
    applicability: str
    description: str

    @property
    def is_verified(self) -> bool:
        return self.status == "verified"


@dataclass
class Procedure:
    id: str = ""
    title: str = ""
    category: str = ""
    steps: List[str] = None
    prerequisites: List[str] = None
    notes: str = None
    source_ids: List[str] = None
    status: str = "draft"
    last_verified: Optional[str] = None
    applicability: Dict[str, Any] = None
    common_issues: List[str] = None
    escalation: str = None
    contact: str = None
    items: List[Dict] = None
    common_corrections: List[str] = None

    @property
    def is_approved(self) -> bool:
        return self.status == "approved"


class KnowledgeBase:
    def __init__(self, data_dir: Path):
        self.data_dir = data_dir
        self.faqs: List[FAQ] = []
        self.sources: Dict[str, Source] = {}
        self.procedures: List[Procedure] = []
        self._load_all()

    def _load_json(self, filename: str) -> List[Dict[str, Any]]:
        path = self.data_dir / filename
        if not path.exists():
            return []
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _load_all(self) -> None:
        self.faqs = [FAQ(**item) for item in self._load_json("faqs.json")]
        self.sources = {item["id"]: Source(**item) for item in self._load_json("sources.json")}
        self.procedures = [Procedure(**item) for item in self._load_json("procedures.json")]

    def get_approved_faqs(self) -> List[FAQ]:
        return [faq for faq in self.faqs if faq.is_approved]

    def get_all_faqs(self) -> List[FAQ]:
        return self.faqs

    def get_source(self, source_id: str) -> Optional[Source]:
        return self.sources.get(source_id)

    def get_sources_for_faq(self, faq: FAQ) -> List[Source]:
        return [self.sources[sid] for sid in faq.source_ids if sid in self.sources]

    def search_faqs(self, query: str, limit: int = 5) -> List[FAQ]:
        query_lower = query.lower()
        scored = []
        for faq in self.faqs:
            if not faq.is_approved and not faq.is_draft:
                continue
            score = 0
            if query_lower in faq.question.lower():
                score += 10
            if query_lower in faq.answer.lower():
                score += 5
            for word in query_lower.split():
                if word in faq.question.lower():
                    score += 2
                if word in faq.answer.lower():
                    score += 1
            if score > 0:
                scored.append((score, faq))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [faq for _, faq in scored[:limit]]

    def get_procedures(self, category: Optional[str] = None) -> List[Procedure]:
        if category:
            return [p for p in self.procedures if p.category == category and p.is_approved]
        return [p for p in self.procedures if p.is_approved]


_knowledge_base: Optional[KnowledgeBase] = None


def get_knowledge_base(data_dir: Optional[Path] = None) -> KnowledgeBase:
    global _knowledge_base
    if _knowledge_base is None:
        if data_dir is None:
            # Go up from backend/app/knowledge/ to project root, then to data/
            data_dir = Path(__file__).parent.parent.parent.parent / "data"
        _knowledge_base = KnowledgeBase(data_dir)
    return _knowledge_base


def reload_knowledge_base(data_dir: Optional[Path] = None) -> KnowledgeBase:
    global _knowledge_base
    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent.parent / "data"
    _knowledge_base = KnowledgeBase(data_dir)
    return _knowledge_base