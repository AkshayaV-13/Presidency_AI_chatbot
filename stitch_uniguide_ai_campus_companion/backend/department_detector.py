"""
Smart Department Detection Engine for UniGuide AI
Classifies student natural-language queries into university departments,
supports multi-intent queries, and maps relevant campus locations.
"""

from typing import List, Dict, Any, Optional
import re

DEPARTMENT_TAXONOMY = {
    "Administration": {
        "primary_terms": ["bonafide", "certificate", "certificates", "student record", "student records", "transcript", "transcripts", "attestation", "administrative", "registrar", "office of registrar", "d block", "id card duplicate"],
        "regex_patterns": [
            r"\bbonafide\b",
            r"\bcertificate[s]?\b",
            r"\btranscript[s]?\b",
            r"\b(student\s+)?record[s]?\b",
            r"\battestation[s]?\b",
            r"\badmin(istrative|istration)?\b",
            r"\bregistrar\b"
        ],
        "default_location": "D Block",
        "description": "Certificates, official records, registrar services, administrative procedures"
    },
    "Examinations": {
        "primary_terms": ["exam", "exams", "examination", "examinations", "timetable", "time table", "hall ticket", "admit card", "results", "revaluation", "grade card", "exam date", "c block", "controller of examinations"],
        "regex_patterns": [
            r"\bexam(s|ination|inations)?\b",
            r"\btime\s*table[s]?\b",
            r"\bhall\s*ticket[s]?\b",
            r"\badmit\s*card[s]?\b",
            r"\bexam\s+date[s]?\b",
            r"\bcontroller\s+of\s+exam[s]?\b"
        ],
        "default_location": "C Block",
        "description": "Official timetables, notifications, and examination administration"
    },
    "Placements": {
        "primary_terms": ["placement", "placements", "placement training", "placement department", "internship", "internships", "campus drive", "recruitment", "interview", "corporate relations", "l block", "job offer"],
        "regex_patterns": [
            r"\bplacement[s]?\b",
            r"\bplacement\s+training\b",
            r"\binternship[s]?\b",
            r"\bcampus\s+recruitment\b",
            r"\bcorporate\s+relations\b",
            r"\bjob\s+offer[s]?\b"
        ],
        "default_location": "L Block",
        "description": "Training and placement-related guidance, corporate relations"
    },
    "Library": {
        "primary_terms": ["library", "book", "books", "borrow", "return book", "journal", "journals", "reading room", "study carrel", "b block", "reference section", "catalog"],
        "regex_patterns": [
            r"\blibrar(y|ies)\b",
            r"\bborrow(\s+a)?\s+book\b",
            r"\bbook[s]?\b",
            r"\breading\s+room\b",
            r"\bstudy\s+carrel[s]?\b",
            r"\bjournal[s]?\b"
        ],
        "default_location": "B Block",
        "description": "Library resources, research collections, book access"
    },
    "Hostel": {
        "primary_terms": ["hostel", "hostel complaint", "hostel administration", "dorm", "dormitory", "warden", "room allotment", "hostel zone", "residence", "hostel mess", "room maintenance"],
        "regex_patterns": [
            r"\bhostel[s]?\b",
            r"\bhostel\s+complaint[s]?\b",
            r"\bdorm(itory)?\b",
            r"\bwarden[s]?\b",
            r"\broom\s+(allotment|maintenance|complaint)\b",
            r"\bresidential\s+life\b"
        ],
        "default_location": "Hostel Zone",
        "description": "Hostel complaints, warden assistance, residential living"
    },
    "Academics": {
        "primary_terms": ["academic", "academics", "faculty advisor", "advisor", "adviser", "subject", "subjects", "coursework", "curriculum", "syllabus", "academic credits", "professor", "a block", "attendance", "attendance percentage"],
        "regex_patterns": [
            r"\bacademic[s]?\b",
            r"\bfaculty(\s+advisor)?\b",
            r"\badvis(or|er)[s]?\b",
            r"\bsubject[s]?\b",
            r"\bcurriculum\b",
            r"\bacademic\s+credit[s]?\b",
            r"\battendance(\s+percentage)?\b"
        ],
        "default_location": "A Block",
        "description": "Academic assistance, faculty advisor support, curriculum guidance"
    },
    "Events": {
        "primary_terms": ["event", "events", "announcement", "announcements", "fest", "symposium", "conference", "cultural fest"],
        "regex_patterns": [
            r"\bevent[s]?\b",
            r"\bannouncement[s]?\b",
            r"\bfest[s]?\b",
            r"\bsymposium\b"
        ],
        "default_location": "D Block",
        "description": "University event announcements and official communications"
    }
}


def detect_departments(query: str) -> List[Dict[str, Any]]:
    """
    Detect all relevant departments for a given natural-language student query.
    Supports detecting multiple departments for compound questions.
    Returns a list of detected department metadata.
    """
    cleaned_query = query.lower().strip()
    detected = []
    
    # Check each department in taxonomy
    for dept_name, meta in DEPARTMENT_TAXONOMY.items():
        score = 0
        matched_terms = []
        
        # Check regex patterns
        for pattern in meta["regex_patterns"]:
            matches = re.findall(pattern, cleaned_query)
            if matches:
                score += 2 * len(matches)
                matched_terms.append(pattern)
                
        # Check primary terms
        for term in meta["primary_terms"]:
            if term in cleaned_query:
                score += 1
                matched_terms.append(term)
                
        if score > 0:
            detected.append({
                "department": dept_name,
                "score": score,
                "location": meta["default_location"],
                "description": meta["description"],
                "matched_terms": list(set(matched_terms))
            })
            
    # Sort detected by score descending
    detected.sort(key=lambda x: x["score"], reverse=True)
    return detected


def split_compound_queries(query: str) -> List[str]:
    """
    Splits compound questions into individual atomic questions if multiple services are targeted.
    Example: 'I need a bonafide certificate and want to know where the library is.'
    -> ['I need a bonafide certificate', 'where the library is']
    """
    # Common conjunctions splitting distinct questions
    split_patterns = [
        r"\s+(?:and\s+also|and\s+additionally|and\s+furthermore|as\s+well\s+as)\s+",
        r"\s+and\s+(?=(?:i\s+)?(?:want|need|wish|would\s+like|where|how|can|what|is\s+there|tell\s+me|who))",
        r"\s*,\s*(?:also|and|plus)\s+",
        r"(?<=\?)\s+(?=[A-Za-z0-9])",
        r"\s*;\s*"
    ]
    
    parts = [query.strip()]
    for pat in split_patterns:
        new_parts = []
        for p in parts:
            split_res = re.split(pat, p, flags=re.IGNORECASE)
            new_parts.extend([s.strip() for s in split_res if s.strip()])
        parts = new_parts
        
    if len(parts) > 1:
        return parts

    # Semantic fallback: if query contains multiple distinct high-scoring departments
    depts = detect_departments(query)
    if len(depts) >= 2 and depts[0]["score"] >= 2 and depts[1]["score"] >= 2:
        # Split on simple 'and' if present
        simple_and_split = re.split(r"\s+and\s+", query, flags=re.IGNORECASE)
        if len(simple_and_split) > 1:
            return [s.strip() for s in simple_and_split if s.strip()]

    return [query.strip()]

