from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from analysis_service import analyze_with_ai
from research_engine import ResearchEngine
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

research_engine = ResearchEngine()


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

class AnalyzeRequest(BaseModel):
    idea: str = Field(min_length=10, max_length=4000)
    target: str = Field(min_length=2, max_length=500)
    monetization: str = Field(default="Subscription", max_length=100)
    differentiation: str = Field(min_length=5, max_length=2000)
    problem: str = Field(default="", max_length=2000)


@api_router.post("/analyze")
async def analyze_idea_endpoint(req: AnalyzeRequest):
    form = req.model_dump()
    pack = await research_engine.research(form)
    analysis = await analyze_with_ai(form, pack)
    if analysis is None:
        raise HTTPException(status_code=503, detail="ai_analysis_unavailable")
    status = pack.status
    label = {
        "success": "Live Research + AI Analysis",
        "partial": "Partial Research + AI Analysis",
        "unavailable": "AI Analysis — Research Unavailable",
    }[status]
    return {
        "source": "ollama-cloud",
        "model": os.environ.get("OLLAMA_MODEL", ""),
        "label": label,
        "researchStatus": status,
        "research": pack.model_dump(),
        "analysis": analysis.model_dump(),
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()