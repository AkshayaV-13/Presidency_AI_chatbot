"""
UniGuide AI - Startup Script
Run this script to launch the UniGuide AI application:
    python run.py
"""

import sys
import os
from pathlib import Path
import uvicorn
from dotenv import load_dotenv

root_dir = Path(__file__).resolve().parent
backend_dir = root_dir / "backend"

# Load environment variables
load_dotenv(backend_dir / ".env")
load_dotenv(root_dir / ".env")

port = int(os.getenv("PORT", 8000))
host = os.getenv("HOST", "127.0.0.1")
api_key = os.getenv("GEMINI_API_KEY", "").strip()

print("=" * 65)
print("  UniGuide AI - Intelligent Campus Helpdesk Companion")
print("  Tagline: Your Campus. Your Questions. One Smart Companion.")
print("=" * 65)
print(f"  * Host: http://{host}:{port}")
if api_key and api_key != "your_gemini_api_key_here":
    masked_key = api_key[:6] + "..." + api_key[-4:] if len(api_key) > 10 else "***"
    print(f"  * Gemini API Status: CONFIGURED (Key: {masked_key})")
else:
    print("  * Gemini API Status: NOT CONFIGURED (Add GEMINI_API_KEY to backend/.env)")
    print("  * Note: Running with verified local knowledge base fallback.")
print(f"  * API Docs: http://{host}:{port}/docs")
print("=" * 65)
print("Starting server... Press Ctrl+C to stop.\n")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
