from typing import List, Dict, Any, Optional
from pathlib import Path
import json
from datetime import datetime

from .loader import KnowledgeBase, FAQ, Source, Procedure


class ValidationError(Exception):
    pass


class ValidationWarning(Exception):
    pass


REQUIRED_FAQ_FIELDS = [
    "id", "question", "answer", "category",
    "source_ids", "status", "last_verified", "applicability"
]

REQUIRED_SOURCE_FIELDS = [
    "id", "title", "url", "publisher",
    "published_at", "retrieved_at", "status",
    "applicability", "description"
]

REQUIRED_PROCEDURE_FIELDS = [
    "id", "title", "category", "steps",
    "prerequisites", "notes", "source_ids",
    "status", "last_verified", "applicability"
]

VALID_STATUSES = {"draft", "approved", "retired"}
VALID_SOURCE_STATUSES = {"unverified", "verified", "deprecated"}
VALID_CATEGORIES = {
    "download", "troubleshooting", "checklist",
    "official-help", "corrections", "fees", "rules", "timetable"
}


def validate_faq(faq: Dict[str, Any], sources: Dict[str, Source]) -> List[str]:
    errors = []

    for field in REQUIRED_FAQ_FIELDS:
        if field not in faq:
            errors.append(f"Missing required field: {field}")

    if "status" in faq and faq["status"] not in VALID_STATUSES:
        errors.append(f"Invalid status: {faq['status']}. Must be one of {VALID_STATUSES}")

    if "category" in faq and faq["category"] not in VALID_CATEGORIES:
        errors.append(f"Invalid category: {faq['category']}. Must be one of {VALID_CATEGORIES}")

    if "source_ids" in faq:
        for sid in faq["source_ids"]:
            if sid not in sources:
                errors.append(f"FAQ references unknown source_id: {sid}")

    if "applicability" in faq:
        app = faq["applicability"]
        required_app = ["programme", "academic_year", "examination"]
        for field in required_app:
            if field not in app:
                errors.append(f"Missing applicability field: {field}")

    if "last_verified" in faq and faq["last_verified"]:
        try:
            datetime.fromisoformat(faq["last_verified"].replace("Z", "+00:00"))
        except ValueError:
            errors.append("last_verified must be a valid ISO 8601 date")

    return errors


def validate_source(source: Dict[str, Any]) -> List[str]:
    errors = []

    for field in REQUIRED_SOURCE_FIELDS:
        if field not in source:
            errors.append(f"Missing required field: {field}")

    if "status" in source and source["status"] not in VALID_SOURCE_STATUSES:
        errors.append(f"Invalid source status: {source['status']}. Must be one of {VALID_SOURCE_STATUSES}")

    if "url" in source:
        url = source["url"]
        if not url.startswith(("http://", "https://")):
            errors.append("Source URL must start with http:// or https://")
        if "example.org" in url or "placeholder" in url.lower():
            errors.append("Source URL appears to be a placeholder (example.org). Replace with verified URL.")

    return errors


def validate_procedure(proc: Dict[str, Any], sources: Dict[str, Source]) -> List[str]:
    errors = []

    for field in REQUIRED_PROCEDURE_FIELDS:
        if field not in proc:
            errors.append(f"Missing required field: {field}")

    if "status" in proc and proc["status"] not in VALID_STATUSES:
        errors.append(f"Invalid status: {proc['status']}. Must be one of {VALID_STATUSES}")

    if "source_ids" in proc:
        for sid in proc["source_ids"]:
            if sid not in sources:
                errors.append(f"Procedure references unknown source_id: {sid}")

    return errors


def validate_knowledge_base(kb: KnowledgeBase) -> Dict[str, List[str]]:
    all_errors = {
        "faqs": [],
        "sources": [],
        "procedures": []
    }

    for faq in kb.faqs:
        errors = validate_faq(faq.__dict__, kb.sources)
        if errors:
            all_errors["faqs"].extend([f"FAQ {faq.id}: {e}" for e in errors])

    for source in kb.sources.values():
        errors = validate_source(source.__dict__)
        if errors:
            all_errors["sources"].extend([f"Source {source.id}: {e}" for e in errors])

    for proc in kb.procedures:
        errors = validate_procedure(proc.__dict__, kb.sources)
        if errors:
            all_errors["procedures"].extend([f"Procedure {proc.id}: {e}" for e in errors])

    return all_errors


def check_unverified_data(kb: KnowledgeBase) -> Dict[str, List[str]]:
    warnings = {
        "draft_faqs": [],
        "unverified_sources": [],
        "unapproved_procedures": []
    }

    for faq in kb.faqs:
        if faq.status == "draft":
            warnings["draft_faqs"].append(f"FAQ {faq.id}: '{faq.question[:50]}...' is draft")

    for source in kb.sources.values():
        if source.status != "verified":
            warnings["unverified_sources"].append(f"Source {source.id}: {source.title} is {source.status}")

    for proc in kb.procedures:
        if proc.status != "approved":
            warnings["unapproved_procedures"].append(f"Procedure {proc.id}: {proc.title} is {proc.status}")

    return warnings