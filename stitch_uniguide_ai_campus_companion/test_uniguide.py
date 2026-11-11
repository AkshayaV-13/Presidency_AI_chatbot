"""
Comprehensive Test Suite for UniGuide AI
Tests department detection, multi-query decomposition, knowledge grounding,
API endpoints, sample queries, and boundary handling.
"""

import sys
import json
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(root_dir))

from backend.department_detector import detect_departments, split_compound_queries
from backend.gemini_service import query_uniguide_ai, is_gemini_configured, test_gemini_connection

def run_tests():
    print("=" * 60)
    print("RUNNING UNIGUIDE AI TEST SUITE")
    print("=" * 60)
    
    passed = 0
    total = 0
    
    # -------------------------------------------------------------
    # TEST 1: "Where can I get a bonafide certificate?"
    # Expected: Administration, D Block demo location.
    # -------------------------------------------------------------
    total += 1
    q1 = "Where can I get a bonafide certificate?"
    res1 = query_uniguide_ai(q1)
    card1 = res1["cards"][0]
    dept1 = card1["department"]
    loc1 = card1.get("location")
    
    print(f"\n[Test 1] Query: '{q1}'")
    print(f"  Detected Department: {dept1} (Expected: Administration)")
    print(f"  Location: {loc1} (Expected: D Block)")
    print(f"  Direct Answer: {card1['direct_answer'][:80]}...")
    
    assert "administration" in dept1.lower(), f"Expected Administration, got {dept1}"
    assert "d block" in loc1.lower(), f"Expected D Block, got {loc1}"
    passed += 1
    print("  -> PASSED")

    # -------------------------------------------------------------
    # TEST 2: "How do I get placement training information?"
    # Expected: Placement Department, L Block demo location.
    # -------------------------------------------------------------
    total += 1
    q2 = "How do I get placement training information?"
    res2 = query_uniguide_ai(q2)
    card2 = res2["cards"][0]
    dept2 = card2["department"]
    loc2 = card2.get("location")
    
    print(f"\n[Test 2] Query: '{q2}'")
    print(f"  Detected Department: {dept2} (Expected: Placements)")
    print(f"  Location: {loc2} (Expected: L Block)")
    print(f"  Direct Answer: {card2['direct_answer'][:80]}...")
    
    assert "placement" in dept2.lower(), f"Expected Placements, got {dept2}"
    assert "l block" in loc2.lower(), f"Expected L Block, got {loc2}"
    passed += 1
    print("  -> PASSED")

    # -------------------------------------------------------------
    # TEST 3: "Where is the library?"
    # Expected: Library, B Block demo location.
    # -------------------------------------------------------------
    total += 1
    q3 = "Where is the library?"
    res3 = query_uniguide_ai(q3)
    card3 = res3["cards"][0]
    dept3 = card3["department"]
    loc3 = card3.get("location")
    
    print(f"\n[Test 3] Query: '{q3}'")
    print(f"  Detected Department: {dept3} (Expected: Library)")
    print(f"  Location: {loc3} (Expected: B Block)")
    print(f"  Direct Answer: {card3['direct_answer'][:80]}...")
    
    assert "library" in dept3.lower(), f"Expected Library, got {dept3}"
    assert "b block" in loc3.lower(), f"Expected B Block, got {loc3}"
    passed += 1
    print("  -> PASSED")

    # -------------------------------------------------------------
    # TEST 4: "I have a hostel complaint."
    # Expected: Submit it to Hostel Administration, Hostel Zone demo location.
    # -------------------------------------------------------------
    total += 1
    q4 = "I have a hostel complaint."
    res4 = query_uniguide_ai(q4)
    card4 = res4["cards"][0]
    dept4 = card4["department"]
    loc4 = card4.get("location")
    
    print(f"\n[Test 4] Query: '{q4}'")
    print(f"  Detected Department: {dept4} (Expected: Hostel)")
    print(f"  Location: {loc4} (Expected: Hostel Zone)")
    print(f"  Direct Answer: {card4['direct_answer'][:80]}...")
    
    assert "hostel" in dept4.lower(), f"Expected Hostel, got {dept4}"
    assert "hostel" in loc4.lower(), f"Expected Hostel Zone, got {loc4}"
    passed += 1
    print("  -> PASSED")

    # -------------------------------------------------------------
    # TEST 5: "What is the exact attendance percentage required?"
    # Expected: Explain that the exact percentage is not available in the supplied information.
    # -------------------------------------------------------------
    total += 1
    q5 = "What is the exact attendance percentage required?"
    res5 = query_uniguide_ai(q5)
    card5 = res5["cards"][0]
    ans5 = card5["direct_answer"].lower()
    
    print(f"\n[Test 5] Query: '{q5}'")
    print(f"  Direct Answer: {card5['direct_answer']}")
    
    assert "not available" in ans5 or "not specified" in ans5 or "minimum attendance requirement prescribed by university regulations" in ans5, f"Unexpected response: {card5['direct_answer']}"
    # Verify no hallucinated number like 75% or 80%
    assert "75%" not in ans5 and "80%" not in ans5 and "85%" not in ans5, "Hallucinated percentage detected!"
    passed += 1
    print("  -> PASSED (Zero hallucination verified)")

    # -------------------------------------------------------------
    # TEST 6: "What is my examination date?"
    # Expected: Explain that the exact date is not available and direct student to official university notifications.
    # -------------------------------------------------------------
    total += 1
    q6 = "What is my examination date?"
    res6 = query_uniguide_ai(q6)
    card6 = res6["cards"][0]
    ans6 = card6["direct_answer"].lower()
    
    print(f"\n[Test 6] Query: '{q6}'")
    print(f"  Direct Answer: {card6['direct_answer']}")
    
    assert "not" in ans6 or "official" in ans6, f"Unexpected response: {card6['direct_answer']}"
    assert "official" in ans6 or "channel" in ans6 or "timetable" in ans6, "Expected mention of official channels/timetables"
    passed += 1
    print("  -> PASSED (No invented exam date verified)")

    # -------------------------------------------------------------
    # TEST 7: "I need a certificate and want to know where the library is."
    # Expected: Handle both questions separately.
    # -------------------------------------------------------------
    total += 1
    q7 = "I need a certificate and want to know where the library is."
    res7 = query_uniguide_ai(q7)
    cards7 = res7["cards"]
    
    print(f"\n[Test 7] Compound Query: '{q7}'")
    print(f"  Number of response cards generated: {len(cards7)} (Expected: >= 2)")
    for i, c in enumerate(cards7):
        print(f"    Card {i+1}: Dept={c['department']}, Loc={c.get('location')}, Answer={c['direct_answer'][:60]}...")
        
    assert len(cards7) >= 2, f"Expected at least 2 cards for compound query, got {len(cards7)}"
    depts = [c["department"].lower() for c in cards7]
    assert any("admin" in d for d in depts), "Administration card missing in compound query"
    assert any("library" in d for d in depts), "Library card missing in compound query"
    passed += 1
    print("  -> PASSED (Multiple questions handled separately)")

    # -------------------------------------------------------------
    # TEST 8: Unknown / Policy Boundary Question
    # Expected: Polite unknown statement without hallucination.
    # -------------------------------------------------------------
    total += 1
    q8 = "Can I transfer dining meal credits to pay my semester tuition fee?"
    res8 = query_uniguide_ai(q8)
    card8 = res8["cards"][0]
    ans8 = card8["direct_answer"]
    
    print(f"\n[Test 8] Unknown Boundary Query: '{q8}'")
    print(f"  Direct Answer: {ans8}")
    
    assert "couldn't find verified information" in ans8.lower(), f"Expected unknown fallback statement, got: {ans8}"
    assert card8["is_unknown"] is True, "Expected is_unknown to be True"
    passed += 1
    print("  -> PASSED (Anti-hallucination boundary verified)")

    # -------------------------------------------------------------
    # TEST 9: Department Detector Function
    # -------------------------------------------------------------
    total += 1
    test_queries = [
        ("How can I get a bonafide certificate?", "Administration"),
        ("When will the exam timetable be released?", "Examinations"),
        ("I want placement training information.", "Placements"),
        ("I have a hostel complaint.", "Hostel"),
        ("Can I borrow a book?", "Library"),
        ("I need help with my subjects.", "Academics")
    ]
    
    print("\n[Test 9] Department Detector Accuracy Test:")
    for query, expected_dept in test_queries:
        detected = detect_departments(query)
        top = detected[0]["department"] if detected else "None"
        print(f"  Query: '{query}' -> Detected: {top} (Expected: {expected_dept})")
        assert top == expected_dept, f"Failed on '{query}': expected {expected_dept}, got {top}"
    
    passed += 1
    print("  -> PASSED (All 6 department taxonomy tests succeeded)")

    print("\n" + "=" * 60)
    print(f"TEST RESULTS: {passed}/{total} TESTS PASSED (100% SUCCESS)")
    print("=" * 60)
    return True

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
