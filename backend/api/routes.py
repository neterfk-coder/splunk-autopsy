from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import asyncio

from agent.autopsy_agent import AutopsyAgent

router = APIRouter()
agent = AutopsyAgent()


class InvestigationRequest(BaseModel):
    question: str
    time_range: Optional[str] = "last 7 days"
    index: Optional[str] = "main"


class InvestigationResponse(BaseModel):
    investigation_id: str
    status: str
    causal_chain: list
    timeline: list
    report: dict
    queries_executed: int


@router.post("/investigate", response_model=InvestigationResponse)
async def investigate(request: InvestigationRequest):
    try:
        result = await agent.run(
            question=request.question,
            time_range=request.time_range,
            index=request.index
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/investigations")
async def list_investigations():
    return {"investigations": []}


@router.get("/health")
def health():
    return {"status": "ok"}
