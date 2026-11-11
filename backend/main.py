"""
UniGuide AI - Main FastAPI Application
Serves the REST API, integrates Gemini AI, Department Detection,
University Knowledge Base, Demo Campus Navigation, and serves the frontend application.
"""

import os
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, Field

from backend.department_detector import detect_departments, split_compound_queries
from backend.gemini_service import (
    query_uniguide_ai,
    test_gemini_connection,
    is_gemini_configured,
    KNOWLEDGE_BASE,
    LOCATIONS_DATA
)

# Initialize FastAPI application
app = FastAPI(
    title="UniGuide AI Campus Helpdesk",
    description="Your Campus. Your Questions. One Smart Companion.",
    version="1.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
current_dir = Path(__file__).resolve().parent
frontend_dir = current_dir.parent / "frontend"


# Pydantic Request Models
class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Student's query or question")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Previous chat turns in current session")


class DepartmentDetectRequest(BaseModel):
    query: str = Field(..., min_length=1)


# API Endpoints
@app.get("/api/health")
@app.get("/api/status")
def get_system_status():
    """Get system health, Gemini API configuration status, and knowledge metrics."""
    gemini_ready = is_gemini_configured()
    return {
        "status": "healthy",
        "app_name": "UniGuide AI",
        "tagline": "Your Campus. Your Questions. One Smart Companion.",
        "gemini_api_configured": gemini_ready,
        "knowledge_base_categories": len(KNOWLEDGE_BASE.get("university_info", {})),
        "demo_campus_locations": len(LOCATIONS_DATA.get("locations", [])),
        "api_message": "Gemini API key is configured." if gemini_ready else "Gemini API key is not configured in backend/.env. Using verified local knowledge base."
    }


@app.post("/api/test-gemini")
def test_gemini_api():
    """Explicitly test Gemini API key and live connectivity."""
    result = test_gemini_connection()
    return result


@app.post("/api/chat")
def handle_chat(request: ChatRequest):
    """
    Process student questions.
    Returns structured response cards with department detection, location, next action, source, and follow-ups.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    result = query_uniguide_ai(request.query.strip(), request.history)
    return result


@app.post("/api/detect-department")
def handle_detect_department(request: DepartmentDetectRequest):
    """Directly detect the university department associated with a query."""
    detected = detect_departments(request.query)
    sub_queries = split_compound_queries(request.query)
    return {
        "query": request.query,
        "detected_departments": detected,
        "primary_department": detected[0]["department"] if detected else "Unknown",
        "is_compound_query": len(sub_queries) > 1,
        "sub_queries": sub_queries
    }


@app.get("/api/knowledge")
def get_knowledge_base():
    """Return the structured JSON university knowledge base."""
    return KNOWLEDGE_BASE


@app.get("/api/locations")
def get_campus_locations():
    """Return all demonstration campus locations, walking routes, and services."""
    return LOCATIONS_DATA


@app.get("/api/locations/{location_id}")
def get_location_detail(location_id: str):
    """Return details for a specific demo campus location."""
    for loc in LOCATIONS_DATA.get("locations", []):
        if loc.get("id") == location_id or loc.get("code").lower() == location_id.lower():
            return loc
    raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found in demo campus data.")


# Static Files & SPA Routing
if frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")

    @app.get("/")
    def serve_index():
        index_file = frontend_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        return JSONResponse({"message": "UniGuide AI Backend is running. Frontend index.html not found."})

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        # Allow API routes to pass through or 404
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        
        file_path = frontend_dir / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        
        index_file = frontend_dir / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Resource not found")
