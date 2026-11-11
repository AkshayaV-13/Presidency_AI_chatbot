# UniGuide AI

> **Your Campus. Your Questions. One Smart Companion.**

UniGuide AI is a full-stack, AI-powered university campus helpdesk and wayfinding companion designed to assist students with university information, departmental routing, campus services, and navigation across a demonstration campus.

Built with **Google Stitch's** modern collegiate design system, **FastAPI**, and **Google Gemini AI SDK (`google-genai`)**, UniGuide AI strictly adheres to verified university knowledge, prevents hallucinations, handles multi-intent questions separately, and features an interactive schematic campus map.

---

## Key Features

1. **AI Campus Concierge (Gemini AI)**:
   - Powered by Google Gemini (`gemini-2.5-flash` / `gemini-1.5-flash`).
   - Strict factual grounding against the official university FAQ knowledge base.
   - Responds with polite boundary statements whenever information is unavailable: *"I couldn't find verified information about this in the available university information."*
   - Never hallucinates attendance percentages, exam dates, fees, contact numbers, email addresses, or office timings.
   - Transparent fallback: Operates deterministically with verified knowledge if the API key is not yet configured or if an error occurs. Never pretends an API call succeeded when it didn't.

2. **Smart Department Detection**:
   - Automatically detects associated university departments:
     - **Administration** (Bonafide certificates, student records, registrar services)
     - **Examinations** (Timetables, official notifications, evaluation)
     - **Placements** (Placement training, recruitment, corporate relations)
     - **Library** (Book circulation, reading rooms, catalog access)
     - **Hostel** (Hostel complaints, warden assistance, residential living)
     - **Academics** (Faculty advisor guidance, subject and curriculum assistance)
     - **Events** (Official university announcements and channels)
   - Displays detected department badges, confidence tags, and physical room locations.

3. **Smart Structured Response Cards**:
   - **Direct Answer**: Concise, understandable answer.
   - **Detected Department**: Category pill with icon and confidence rating.
   - **Campus Location**: Relevant demo zone (e.g., *D Block, Room D-104*).
   - **Recommended Next Action**: Clear actionable guidance.
   - **Source Category**: Official citation tag (e.g., *Office of the Registrar*).
   - **Suggested Follow-up Chips**: One-click follow-up queries.
   - **Map Action**: Direct one-click *"Open in Campus Map"* button that switches views and highlights the building and route.

4. **Multi-Query Intelligence**:
   - Handles compound questions (e.g., *"I need a certificate and want to know where the library is."*).
   - Generates separate response cards for each detected service.

5. **Interactive Demonstration Campus Map**:
   - High-detail 2D architectural schematic vector map (SVG) with Central Fountain, Memorial Grove, walkways, and North Concourse.
   - Clearly identified as an **illustrative demo campus map** for demonstration purposes.
   - 6 Demo Locations:
     - **A Block**: Academic Office & Faculty Advisors
     - **B Block**: University Central Library
     - **C Block**: Examination Office
     - **D Block**: Administrative Office
     - **L Block**: Placement Office
     - **Hostel Zone**: Hostel Administration
   - Real-time animated walking route from South Gate (Main Entrance) to the selected building.
   - Search bar, zoom in/out/reset controls, compass rose, and walking simulation.

6. **Comprehensive Campus Services Directory**:
   - 6 department wings with category filtering (Academic Affairs, Student Life, Facilities, Career, All).
   - Real-time search filter and instant *"Ask UniGuide"* shortcut.

---

## Project Structure

```
stitch_uniguide_ai_campus_companion/
├── backend/
│   ├── data/
│   │   ├── knowledge_base.json      # Structured university knowledge base
│   │   └── locations.json           # Structured demo campus locations & routes
│   ├── .env                         # Local environment variables (contains GEMINI_API_KEY)
│   ├── .env.example                 # Environment template
│   ├── department_detector.py       # Smart department taxonomy & query segmentation
│   ├── gemini_service.py            # Official Google GenAI SDK integration & fallback
│   └── main.py                      # FastAPI application & static asset server
├── frontend/
│   ├── css/
│   │   └── custom.css               # Blueprint textures, route animations & glassmorphism
│   ├── js/
│   │   └── app.js                   # Client state, routing, chat engine, SVG map controller
│   └── index.html                   # Unified, responsive collegiate web application
├── stitch_uniguide_ai_campus_companion/ # Original exported Google Stitch project & DESIGN.md
├── .env.example                     # Root environment template
├── .gitignore                       # Protects secrets from version control
├── requirements.txt                 # Python dependencies manifest
├── run.py                           # One-command application launcher
├── test_uniguide.py                 # Automated test suite for sample questions
└── README.md                        # Documentation & setup guide
```

---

## Quickstart & Running Instructions

### 1. Requirements
- Python 3.10+ (Tested with Python 3.13)
- Windows / macOS / Linux

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
*(Dependencies: `fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `google-genai`, `requests`)*

### 3. Configure Your Gemini API Key
1. Open `backend/.env` (or root `.env`).
2. Add your Gemini API key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   PORT=8000
   HOST=127.0.0.1
   ```
*(Note: If no key is set, UniGuide AI runs transparently with the verified university knowledge base fallback).*

### 4. Start the Application
Run the launcher:
```bash
python run.py
```
Or start via Uvicorn directly:
```bash
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open your browser at:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

API Documentation (Swagger UI):
👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## Automated Verification & Testing

UniGuide AI includes an automated test suite verifying all 7 sample questions, compound queries, and boundary questions:

```bash
python test_uniguide.py
```

### Verified Sample Questions:

| # | Question | Expected Output | Status |
|---|---|---|---|
| 1 | *"Where can I get a bonafide certificate?"* | Administration Department, D Block demo location | ✅ Passed |
| 2 | *"How do I get placement training information?"* | Placement Department, L Block demo location | ✅ Passed |
| 3 | *"Where is the library?"* | Library, B Block demo location | ✅ Passed |
| 4 | *"I have a hostel complaint."* | Hostel Administration, Hostel Zone demo location | ✅ Passed |
| 5 | *"What is the exact attendance percentage required?"* | Explains exact % is not available; follow university regulations (Zero hallucination) | ✅ Passed |
| 6 | *"What is my examination date?"* | Explains exact date is not available; check official channels (No invented dates) | ✅ Passed |
| 7 | *"I need a certificate and want to know where the library is."* | Compound question handled separately with 2 distinct cards | ✅ Passed |
| 8 | *"Can I transfer dining meal credits to pay tuition fee?"* | Polite boundary fallback: *"I couldn't find verified information about this in the available university information."* | ✅ Passed |
| 9 | Department Taxonomy Detection | 100% accuracy across 6 core university departments | ✅ Passed |

---

## API Endpoints

- `GET /api/status`: System status, Gemini API configuration state, and metrics.
- `POST /api/chat`: Submit natural-language student questions (`{"query": "...", "history": [...]}`).
- `POST /api/detect-department`: Classify queries into departments and sub-queries.
- `GET /api/locations`: Returns all structured demo campus locations and walking routes.
- `GET /api/locations/{id}`: Returns details for a specific demo campus zone.
- `GET /api/knowledge`: Returns the university FAQ knowledge base.
- `POST /api/test-gemini`: Tests live Gemini API connectivity.

---

## Security & Best Practices

- **Never exposes the Gemini API key to the frontend.**
- **All requests to Gemini are processed server-side in `backend/gemini_service.py`.**
- `.env` is ignored by git via `.gitignore`.
- `.env.example` contains only placeholder credentials.
