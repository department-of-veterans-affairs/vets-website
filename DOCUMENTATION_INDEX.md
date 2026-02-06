# Delayed Refill Alert - Documentation Index

This documentation explains the "Some refills are taking longer than expected" alert in the VA Health and Benefits (VAHB) medications application.

## 📋 Quick Navigation

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[README_REFILL_ALERT.md](README_REFILL_ALERT.md)** | Start here - Overview and navigation | 5 min |
| **[REFILL_ALERT_SUMMARY.md](REFILL_ALERT_SUMMARY.md)** | Direct answers to key questions | 10 min |
| **[REFILL_ALERT_FLOW_DIAGRAM.md](REFILL_ALERT_FLOW_DIAGRAM.md)** | Visual diagrams and examples | 15 min |
| **[DELAYED_REFILL_ALERT_DOCUMENTATION.md](DELAYED_REFILL_ALERT_DOCUMENTATION.md)** | Complete technical reference | 20 min |

## 🎯 Your Questions Answered

### Q1: What backend logic or event triggers this alert?

**Short Answer**: Backend returns `meta.recentlyRequested` array; frontend filters it using two time-based conditions:
1. **Refill in Process** status + past the expected `refillDate`
2. **Submitted** status + more than 7 days old

**Read**: [REFILL_ALERT_SUMMARY.md - Question 1](REFILL_ALERT_SUMMARY.md#question-1-what-backend-logic-or-event-triggers-this-alert)

### Q2: How are medication links populated?

**Short Answer**: Filtered prescriptions are sorted alphabetically and rendered as links using `prescriptionId` (for URL) and `prescriptionName` (for text).

**Read**: [REFILL_ALERT_SUMMARY.md - Question 2](REFILL_ALERT_SUMMARY.md#question-2-what-logic-or-data-allows-the-veterans-affected-medications-to-populate-as-links-within-the-alert)

## 🔑 Key Implementation Details

### Alert Triggers (2 conditions)

**Condition 1**: Refill in Process - Past Expected Date
```javascript
dispStatus === "Active: Refill in Process" 
  && refillDate exists 
  && current date > refillDate
```

**Condition 2**: Submitted - Over 7 Days
```javascript
dispStatus === "Active: Submitted"
  && refillSubmitDate exists
  && refillSubmitDate was > 7 days ago
```

### Core Files (6 key files)

| File | Purpose | Lines |
|------|---------|-------|
| `components/shared/DelayedRefillAlert.jsx` | Alert UI component | 64 |
| `util/helpers/isRefillTakingLongerThanExpected.js` | Delay detection logic | 34 |
| `util/helpers/filterRecentlyRequestedForAlerts.js` | Filter API data | 19 |
| `api/prescriptionsApi.js` | API integration | 95-96, 140-141 |
| `containers/Prescriptions.jsx` | List page integration | 165, 596-608 |
| `containers/RefillPrescriptions.jsx` | Refill page integration | 49, 210-217 |

## 📊 Data Flow Summary

```
Backend API (meta.recentlyRequested)
    ↓
filterRecentlyRequestedForAlerts() 
    ↓
isRefillTakingLongerThanExpected() [applies 2 conditions]
    ↓
refillAlertList (filtered array)
    ↓
DelayedRefillAlert Component (sorts & renders)
    ↓
User sees alert with clickable medication links
```

## ⚡ Critical Values for Alignment

- **Time Threshold**: Exactly **7 days** for submitted status
- **Status Strings**: `"Active: Refill in Process"`, `"Active: Submitted"` (case-sensitive!)
- **API Fields**: `prescriptionId`, `prescriptionName`, `dispStatus`, `refillDate`, `refillSubmitDate`

## 🧪 Testing

- **Unit Tests**: 37+ test cases covering edge cases
- **E2E Tests**: Multiple Cypress tests for user flows
- **Mock Data**: 15+ edge case scenarios in mock API

## 📞 For Web/Mobile Alignment

Verify these match across all platforms:
- [ ] API field names
- [ ] Status string values (exact case/spacing)
- [ ] Time thresholds (7 days)
- [ ] Date fallback logic (rxRfRecords)
- [ ] Feature flag availability

## 🚀 Reading Recommendations

**For Quick Understanding (15 min total):**
1. README_REFILL_ALERT.md (5 min)
2. REFILL_ALERT_SUMMARY.md (10 min)

**For Implementation Details (30 min total):**
1. REFILL_ALERT_SUMMARY.md (10 min)
2. REFILL_ALERT_FLOW_DIAGRAM.md (15 min)
3. Key sections of DELAYED_REFILL_ALERT_DOCUMENTATION.md (5 min)

**For Complete Understanding (50 min total):**
Read all four documents in order.

---

**Application**: VA Health and Benefits (VAHB) - Medications Module  
**Repository**: vets-website  
**Path**: `src/applications/mhv-medications/`  
**Documentation Created**: October 2024
