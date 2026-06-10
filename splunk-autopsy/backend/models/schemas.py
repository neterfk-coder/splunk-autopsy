from pydantic import BaseModel
from typing import Optional, List


class InvestigationRequest(BaseModel):
    question: str
    time_range: Optional[str] = "last 7 days"
    index: Optional[str] = "main"


class CausalNode(BaseModel):
    id: str
    description: str
    business_metric: str
    confidence: float
    result_summary: str
    type: str


class TimelineEvent(BaseModel):
    order: int
    event: str
    impact: str
    confidence: float
    type: str


class InvestigationResponse(BaseModel):
    investigation_id: str
    status: str
    causal_chain: List[dict]
    timeline: List[dict]
    report: dict
    queries_executed: int
