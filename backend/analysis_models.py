from typing import List, Literal, Optional

from pydantic import BaseModel, Field

Verdict = Literal["DON'T KILL IT", "NOT YET", "KILL IT"]
Confidence = Literal["High", "Medium", "Low"]
RiskLevel = Literal["Low", "Moderate", "High"]


class Factor(BaseModel):
    score: int = Field(ge=0, le=100)
    riskLevel: RiskLevel
    explanation: str = Field(min_length=1)
    reasoning: List[str] = Field(default_factory=list)
    confidence: Confidence = "Medium"


class BrutalItem(BaseModel):
    severity: Literal["critical", "moderate", "positive"] = "moderate"
    title: str = Field(min_length=1)
    detail: str = Field(min_length=1)


class EvidenceItem(BaseModel):
    title: str = Field(min_length=1)
    level: str = Field(min_length=1)
    strength: str = "Insufficient evidence"
    points: List[str] = Field(default_factory=list)


class Improvement(BaseModel):
    change: str = ""
    explanation: str = ""
    reasons: List[str] = Field(default_factory=list)


class IdeaAnalysis(BaseModel):
    overallViabilityScore: int = Field(ge=0, le=100)
    killRiskScore: int = Field(ge=0, le=100)
    verdict: Verdict
    confidence: Confidence
    summary: str = Field(min_length=1)
    problemStrength: Factor
    marketOpportunity: Factor
    competition: Factor
    differentiation: Factor
    monetization: Factor
    distribution: Factor
    executionFeasibility: Factor
    defensibility: Factor
    brutalReality: List[BrutalItem] = Field(min_length=3, max_length=5)
    risks: List[str] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    improvement: Improvement = Field(default_factory=Improvement)
    improvementAvailable: bool
    projectedViabilityScore: Optional[int] = Field(default=None, ge=0, le=100)
