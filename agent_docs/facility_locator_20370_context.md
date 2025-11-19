# Facility Locator Issue #20370 - Implementation Context

## Problem
Form inputs trigger immediate Redux updates, causing premature UI metadata changes in search results before user submits.

## Solution
Implement **draft state pattern**: form changes update local state only; Redux updates on submit.

## Key Concepts

### Draft State vs Committed State
- **Draft State**: Local React state (`draftFormState`) - uncommitted form values
- **Committed State**: Redux state (`searchQuery`) - last executed search parameters

### Core Pattern
```javascript
// SearchForm maintains draft state
const [draftFormState, setDraftFormState] = useState({...});

// Handlers update draft only (NO onChange() calls)
const handleChange = (field, value) => {
  setDraftFormState({ ...draftFormState, [field]: value });
};

// Submit commits draft to Redux
const handleSubmit = () => {
  onChange(draftFormState); // Single Redux update
  // ... execute search
};
```

## File Locations

**Main Files:**
- `src/applications/facility-locator/components/search-form/index.jsx` - Core form (T1-T4, T6, T9)
- `src/applications/facility-locator/components/search-form/location/AddressAutosuggest.jsx` - Location input (T5)
- `src/applications/facility-locator/components/search-form/service-type/VAMCServiceAutosuggest.jsx` - VAMC service (T8)
- `src/applications/facility-locator/components/search-form/service-type/index.jsx` - Service type wrapper (T9)

**Test Files:**
- `src/applications/facility-locator/tests/e2e/formStateIsolation.cypress.spec.js` - New e2e tests

## Implementation Rules

### DO
- ✓ Update local draft state in handlers
- ✓ Call `onChange()` ONLY in `handleSubmit`
- ✓ Use callbacks for child components (not Redux)
- ✓ Sync draft state from external changes (geolocation, browser back/forward)
- ✓ Preserve existing special cases (geolocation button, clear button)

### DON'T
- ✗ Call `onChange()` in input handlers
- ✗ Connect child components to Redux (use props/callbacks)
- ✗ Break existing features (geolocation, clear, shareable URLs)
- ✗ Skip validation gates

## Special Cases (Preserve Existing Behavior)

1. **Geolocation Button**: DOES update Redux immediately + auto-search
2. **Clear Button**: DOES update Redux immediately
3. **Browser Back/Forward**: Sync draft from URL params
4. **URL Initialization**: Load params into draft state

## Validation Pattern

After each phase, verify:
1. Form inputs do NOT trigger Redux updates (check console)
2. Submit triggers ONE Redux update
3. Special cases still work
4. No console errors

## References

- **Detailed Specs**: `/Users/bryan/Downloads/Facility_locator_20370_issue/IMPLEMENTATION_SPEC.md`
- **Orchestration Plan**: `/Users/bryan/Downloads/Facility_locator_20370_issue/ORCHESTRATION_PLAN.md`
- **Issue**: #20370

## Quick Start for Agents

1. Read this document
2. Consult ORCHESTRATION_PLAN.md §7 for your specific task
3. Reference IMPLEMENTATION_SPEC.md for code snippets
4. Implement → Lint → Commit
5. Report status to orchestrator
