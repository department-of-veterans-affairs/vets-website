# Delayed Refill Alert Documentation - Quick Start

This directory contains comprehensive documentation about the "Some refills are taking longer than expected" alert in the VA Health and Benefits (VAHB) medications application.

## 📚 Documentation Files

### 1. **REFILL_ALERT_SUMMARY.md** ⭐ START HERE
**Best for**: Quick answers to specific questions
- Directly answers: "What triggers the alert?" and "How are medication links populated?"
- Critical details for web/mobile alignment
- Quick reference for the two trigger conditions
- Recommended questions for your backend team

### 2. **REFILL_ALERT_FLOW_DIAGRAM.md**
**Best for**: Visual learners and understanding the data flow
- ASCII diagrams showing the complete data flow
- Timeline examples with real dates
- Component rendering flow
- Data structure transformations at each stage

### 3. **DELAYED_REFILL_ALERT_DOCUMENTATION.md**
**Best for**: Complete technical reference
- Full API documentation
- Detailed code locations
- Edge cases and error handling
- Testing information
- All related files and their purposes

## 🎯 Quick Answers

### What triggers the alert?
**Backend**: API returns `meta.recentlyRequested` array with recently requested prescriptions  
**Frontend**: Filters using two conditions:
1. **Refill in Process** status + past the expected `refillDate`
2. **Submitted** status + more than 7 days old

### How are medication links populated?
The filtered prescriptions are passed to `DelayedRefillAlert` component which:
1. Sorts medications alphabetically by name
2. Creates links using `prescriptionId` and `prescriptionName`
3. Links point to `/prescription/{prescriptionId}`

## 🔑 Key Files in the Codebase

| File | Purpose | Lines of Interest |
|------|---------|-------------------|
| `components/shared/DelayedRefillAlert.jsx` | Alert UI component | All (64 lines) |
| `util/helpers/isRefillTakingLongerThanExpected.js` | Core delay detection logic | All (34 lines) |
| `util/helpers/filterRecentlyRequestedForAlerts.js` | Filters API data | All (19 lines) |
| `api/prescriptionsApi.js` | API integration & transform | Lines 95-96, 140-141 |
| `containers/Prescriptions.jsx` | List page integration | Line 165, 596-608 |
| `containers/RefillPrescriptions.jsx` | Refill page integration | Line 49, 210-217 |

## ⚡ Critical Values for Alignment

### Time Thresholds
- **Submitted**: Exactly **7 days**
- **Refill in Process**: Past the `refillDate`

### Status String Values (case-sensitive!)
- `"Active: Refill in Process"`
- `"Active: Submitted"`

### Required API Fields
- `prescriptionId` - For link URLs
- `prescriptionName` - For link text
- `dispStatus` - For condition checking
- `refillDate` - Expected fill date
- `refillSubmitDate` - When request was submitted
- `rxRfRecords` - Fallback location for dates

## 🧪 Testing

### Unit Tests
- `tests/components/shared/DelayedRefillAlert.unit.spec.jsx` - Component tests
- `tests/util/helpers/isRefillTakingLongerThanExpected.unit.spec.jsx` - Logic tests (37 test cases!)

### E2E Tests
- Multiple Cypress tests in `tests/e2e/` with names like:
  - `medications-alert-longer-than-expected-*.cypress.spec.js`
  - `medications-alert-submitted-refill-delay-*.cypress.spec.js`

### Mock Data
- `mocks/api/mhv-api/prescriptions/index.js` (lines 192-286)
- Includes 15+ edge cases for comprehensive testing

## 🚀 Next Steps for Web/Mobile Alignment

1. **Compare API Contracts**: Verify `meta.recentlyRequested` structure matches across platforms
2. **Validate Constants**: Ensure status values and time thresholds are identical
3. **Test Edge Cases**: Run the same test scenarios on all platforms
4. **Document Differences**: If any differences exist, document them clearly
5. **Shared Logic**: Consider extracting delay detection logic to a shared package

## 📞 Questions to Ask

When aligning with web and mobile, verify:
- [ ] Does backend return `meta.recentlyRequested` to all platforms?
- [ ] Are field names identical? (`prescriptionId` vs `id`, etc.)
- [ ] Are status strings exactly the same? (capitalization, spacing)
- [ ] Are time thresholds the same? (7 days for submitted)
- [ ] Is the date fallback logic (`rxRfRecords`) used consistently?
- [ ] Is the same feature flag available on all platforms?

## 🔗 Related Systems

This alert is part of the larger MHV (My HealtheVet) medications system which includes:
- Medications list page (all prescriptions)
- Refill prescriptions page (refillable only)
- Prescription details pages (individual medication)
- Refill status tracking
- Prescription history

## 📧 Contact

For questions about this documentation or the VAHB app:
- Check the existing code and tests first
- Review the comprehensive documentation files in this directory
- Consult with your backend team about API structure
- Validate assumptions with mobile and web teams

---

**Last Updated**: October 2024  
**Application**: VA Health and Benefits (VAHB) - Medications Module  
**Repository**: vets-website  
**Application Path**: `src/applications/mhv-medications/`

---

## 📖 Reading Order

For best understanding, read in this order:

1. **This file** (README_REFILL_ALERT.md) - Overview and quick reference
2. **REFILL_ALERT_SUMMARY.md** - Answers to your specific questions
3. **REFILL_ALERT_FLOW_DIAGRAM.md** - Visual understanding of data flow
4. **DELAYED_REFILL_ALERT_DOCUMENTATION.md** - Complete technical details

Happy aligning! 🎯
