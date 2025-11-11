# Follow-up Tickets for VA Profile ID Issue

## Issue 1: [FE] Add VA Profile ID Initialization to Notification Settings Page

**Title:** [FE] Profile | Notification Settings | Add InitializeVAPServiceID wrapper to prevent errors for new users

**Labels:** `frontend`, `notification-settings`, `bug`

**Description:**

### Problem
LOA3 users without an existing VA Profile ID encounter a system error when accessing the Notification Settings page directly. The page fails because the backend `/profile/communication_preferences` endpoint requires a VA Profile ID to exist, but the page doesn't trigger VA Profile ID creation.

### Current Behavior
1. User logs in as LOA3 (verified identity)
2. User navigates directly to Notification Settings
3. Page attempts to fetch communication preferences without initializing VA Profile
4. Backend returns error because VA Profile ID is nil
5. User sees generic system error message

### Expected Behavior
1. User logs in as LOA3 (verified identity)
2. User navigates to Notification Settings
3. Page initializes VA Profile ID if it doesn't exist
4. Backend successfully returns communication preferences
5. User sees their notification settings

### Solution
Wrap the Notification Settings page content with the `InitializeVAPServiceID` component, similar to how Personal Information and Contact Information pages already work.

**File to modify:**
`src/applications/personalization/profile/components/notification-settings/NotificationSettings.jsx`

**Reference implementation:**
See `src/applications/personalization/profile/components/personal-information/PersonalInformationContent.jsx` for example

### Acceptance Criteria
- [ ] Notification Settings page content is wrapped in `InitializeVAPServiceID` component
- [ ] Page shows "Initialization in progress..." state while VA Profile ID is being created
- [ ] Page handles initialization errors gracefully with appropriate error message
- [ ] Unit tests updated to cover initialization states
- [ ] E2E test added for user without VA Profile ID accessing Notification Settings

### Testing Instructions
**Manual Test:**
1. Use a test user that is LOA3 but does not have a VA Profile ID (or mock this state)
2. Navigate directly to `/profile/notifications`
3. Verify page initializes VA Profile ID and loads successfully
4. Verify no system errors are displayed

**Automated Test:**
1. Add Cypress test that mocks user without VA Profile ID
2. Navigate to Notification Settings
3. Assert initialization endpoint is called
4. Assert page loads successfully after initialization

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## Issue 2: [FE] Add VA Profile ID Initialization to Military Information Page

**Title:** [FE] Profile | Military Information | Add InitializeVAPServiceID wrapper to prevent errors for new users

**Labels:** `frontend`, `military-information`, `bug`

**Description:**

### Problem
LOA3 users without an existing VA Profile ID may encounter errors when accessing the Military Information page directly. The page doesn't trigger VA Profile ID creation, which may cause backend API calls to fail.

### Current Behavior
1. User logs in as LOA3 (verified identity)
2. User navigates directly to Military Information
3. Page attempts to fetch service history without initializing VA Profile
4. Backend may return error if VA Profile ID is required
5. User sees error message

### Expected Behavior
1. User logs in as LOA3 (verified identity)
2. User navigates to Military Information
3. Page initializes VA Profile ID if it doesn't exist
4. Backend successfully returns service history
5. User sees their military information

### Solution
Wrap the Military Information page content with the `InitializeVAPServiceID` component, similar to other Profile pages.

**File to modify:**
`src/applications/personalization/profile/components/military-information/MilitaryInformation.jsx`

**Reference implementation:**
See `src/applications/personalization/profile/components/personal-information/PersonalInformationContent.jsx` for example

### Acceptance Criteria
- [ ] Military Information page content is wrapped in `InitializeVAPServiceID` component
- [ ] Page shows "Initialization in progress..." state while VA Profile ID is being created
- [ ] Page handles initialization errors gracefully
- [ ] Unit tests updated to cover initialization states
- [ ] E2E test added for user without VA Profile ID accessing Military Information

### Testing Instructions
**Manual Test:**
1. Use a test user that is LOA3 but does not have a VA Profile ID
2. Navigate directly to `/profile/military-information`
3. Verify page initializes VA Profile ID and loads successfully
4. Verify no errors are displayed

**Automated Test:**
1. Add Cypress test that mocks user without VA Profile ID
2. Navigate to Military Information
3. Assert initialization endpoint is called (if needed)
4. Assert page loads successfully

### Notes
- Need to confirm with backend team if `/profile/service_history` endpoint actually requires VA Profile ID
- If it doesn't require VA Profile ID, this ticket may not be needed

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## Issue 3: [FE] Audit All Profile Pages for VA Profile ID Dependencies

**Title:** [FE] Profile | Audit all Profile pages and ensure consistent VA Profile ID initialization

**Labels:** `frontend`, `technical-debt`, `profile`

**Description:**

### Problem
Only some Profile pages wrap their content with `InitializeVAPServiceID`, leading to inconsistent behavior. Users may encounter errors when accessing certain pages directly if they don't have a VA Profile ID yet.

### Goal
Ensure all Profile pages that depend on VA Profile services handle VA Profile ID initialization consistently.

### Tasks
- [ ] **Inventory Profile Pages**
  - List all Profile subpages
  - Identify which currently use `InitializeVAPServiceID`
  - Identify which pages call VA Profile backend endpoints

- [ ] **Identify Backend Dependencies**
  - Document which pages call which backend endpoints
  - Confirm with backend team which endpoints require VA Profile ID
  - Create mapping of pages → endpoints → requirements

- [ ] **Add Missing Initialization**
  - For each page that needs VA Profile ID but doesn't initialize:
    - Add `InitializeVAPServiceID` wrapper
    - Add initialization loading state
    - Add initialization error handling

- [ ] **Update Documentation**
  - Document which pages require VA Profile ID initialization
  - Add comments in code explaining why initialization is needed
  - Update developer documentation

### Pages to Check
1. ✅ Personal Information (already has InitializeVAPServiceID)
2. ✅ Contact Information (already has InitializeVAPServiceID)
3. ❌ Notification Settings (Issue #1 - needs initialization)
4. ❓ Military Information (Issue #2 - verify if needed)
5. ❓ Veteran Status Card
6. ❓ Direct Deposit
7. ❓ Connected Applications
8. ❓ Account Security
9. ❓ Health Care Settings (if enabled)
10. ❓ Personal Health Care Contacts
11. ❓ Accredited Representative
12. ❓ Letters and Documents

### Acceptance Criteria
- [ ] All Profile pages that require VA Profile ID use `InitializeVAPServiceID`
- [ ] Pages that don't require VA Profile ID are documented as such
- [ ] Consistent error handling across all pages
- [ ] Consistent loading states during initialization
- [ ] Documentation updated with findings

### Testing
- [ ] Manual test each page without VA Profile ID
- [ ] Verify no unexpected errors occur
- [ ] Verify all pages either initialize or work without initialization

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## Issue 4: [BE] Document VA Profile ID Requirements for All Profile Endpoints

**Title:** [BE] Profile | Document which endpoints require VA Profile ID and other identifiers

**Labels:** `backend`, `documentation`, `profile`

**Description:**

### Problem
Frontend developers don't have clear documentation about which backend Profile endpoints require:
- VA Profile ID
- ICN (MVI identifier)
- EDIPI (DoD ID)
- Other identifiers

This leads to:
- Trial-and-error development
- Inconsistent error handling
- Poor user experience when identifiers are missing

### Goal
Create comprehensive documentation of identifier requirements for all Profile-related backend endpoints.

### Required Information for Each Endpoint

For each endpoint, document:

1. **Endpoint details**
   - Path and HTTP method
   - Purpose/description

2. **Required identifiers**
   - VA Profile ID: Yes/No/Optional
   - ICN: Yes/No/Optional
   - EDIPI: Yes/No/Optional
   - Other: (specify)

3. **Behavior when identifiers are missing**
   - Error code returned
   - Error message
   - Can endpoint auto-create missing identifiers?

4. **Initialization requirements**
   - Must VA Profile ID be initialized first?
   - What happens if user is not initialized?

### Endpoints to Document

- `/profile/initialize_vet360_id` (POST)
- `/profile/personal_information` (GET)
- `/profile/communication_preferences` (GET, POST, PATCH)
- `/profile/service_history` (GET)
- `/profile/full_name` (GET)
- `/profile/telephones` (GET, POST, PUT, DELETE)
- `/profile/email_addresses` (GET, POST, PUT, DELETE)
- `/profile/addresses` (GET, POST, PUT, DELETE)
- `/profile/preferred_names` (GET, POST, PUT, DELETE)
- `/profile/gender_identities` (GET, POST, PUT, DELETE)
- Any other Profile endpoints

### Acceptance Criteria
- [ ] Documentation created listing all Profile endpoints
- [ ] Each endpoint has identifier requirements documented
- [ ] Error codes and messages documented for missing identifiers
- [ ] Documentation is accessible to frontend developers
- [ ] Documentation includes examples

### Suggested Format

```markdown
## POST /profile/initialize_vet360_id

**Purpose:** Creates a VA Profile ID for the authenticated user if one doesn't exist

**Required Identifiers:**
- ICN: Yes (user must be in MVI)
- EDIPI: No
- VA Profile ID: No (this endpoint creates it)

**Returns:**
- 201: VA Profile ID created
- 200: VA Profile ID already exists
- 403: User not in MVI or not eligible
- 500: Service error

**Auto-creates VA Profile ID:** Yes, this is the initialization endpoint
```

### Related Issues
- Issue #1: FE needs to know which pages need initialization
- Issue #3: FE audit depends on this documentation

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## Issue 5: [BE] Consider Auto-Initialization of VA Profile IDs for LOA3 Users

**Title:** [BE] Profile | Evaluate auto-creating VA Profile IDs for LOA3 users on first Profile API call

**Labels:** `backend`, `enhancement`, `profile`

**Description:**

### Problem
Currently, VA Profile IDs are only created when specific frontend pages trigger the initialization endpoint. This creates a poor user experience:
- Users get errors if they visit certain pages first
- Frontend must wrap pages with initialization components
- Inconsistent behavior across different entry points

### Proposal
Backend Profile endpoints should automatically initialize VA Profile IDs for eligible LOA3 users when they don't exist, rather than returning errors.

### Benefits
1. **Better UX**: No errors for new users regardless of entry point
2. **Simpler Frontend**: Less defensive programming needed
3. **Consistency**: All Profile endpoints work the same way
4. **Reduced Support**: Fewer "system error" tickets from users

### Questions to Answer

1. **Is auto-initialization technically feasible?**
   - Are there constraints that prevent auto-creating VA Profile IDs?
   - What are the risks?

2. **Which endpoints should auto-initialize?**
   - All Profile endpoints?
   - Only certain endpoints?
   - Should there be an opt-in/opt-out mechanism?

3. **What are the eligibility criteria?**
   - LOA3 authentication level
   - User in MVI (has ICN)
   - Any other requirements?

4. **Are there cases where we shouldn't auto-create?**
   - Deceased veterans
   - Fiduciary flagged users
   - Incompetent status
   - Others?

5. **Performance impact?**
   - Would auto-initialization slow down API responses?
   - Should it be async?
   - Caching strategy?

### Proposed Implementation

**Option A: Lazy Initialization**
- First Profile API call for user without VA Profile ID triggers initialization
- Initialization happens inline with the request
- Subsequent calls use existing VA Profile ID

**Option B: Login-time Initialization**
- Create VA Profile ID during login process for LOA3 users
- Profile endpoints assume VA Profile ID exists
- Reduces initialization delay during Profile navigation

**Option C: Hybrid Approach**
- Try to initialize during login (best effort)
- Fall back to lazy initialization on first Profile API call if login initialization failed

### Acceptance Criteria
- [ ] Investigation completed with findings documented
- [ ] Decision made on whether to implement auto-initialization
- [ ] If implementing: design document created
- [ ] If not implementing: reasons documented for future reference
- [ ] Frontend team informed of decision

### Alternative Solutions
If auto-initialization is not feasible:
1. Document why it's not possible
2. Ensure frontend best practices are documented
3. Improve error messages when VA Profile ID is missing

### Related Issues
- Issue #1, #2, #3: Frontend workarounds needed if this isn't implemented
- Issue #4: Documentation should include initialization strategy

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## Issue 6: [Design/UX] Improve Error Messages When VA Profile ID Is Missing

**Title:** [Design/UX] Profile | Design better error states for VA Profile initialization failures

**Labels:** `design`, `ux`, `profile`, `error-handling`

**Description:**

### Problem
When VA Profile ID initialization fails or is pending, users see:
- Generic "system error" messages
- Technical error messages not meant for users
- No indication of what's happening or how to fix it
- No progress indication during initialization

### Current User Experience
```
User navigates to Notification Settings
  ↓
[Error message displayed]
"We're sorry. Something went wrong on our end."
  ↓
User confused, no next steps
```

### Improved User Experience Goal
```
User navigates to Notification Settings
  ↓
[Friendly loading message]
"Setting up your profile for the first time..."
  ↓
If successful: Page loads normally
If failed: Clear error with next steps
```

### Design Requirements

#### Loading State (During Initialization)
- Friendly message: "We're setting up your profile..."
- Progress indicator (spinner or skeleton)
- Reassurance that this is normal for first-time access
- Estimated time or "this should only take a moment"

#### Success State
- Transition smoothly to page content
- No jarring loading → content jump
- Possibly brief confirmation: "Your profile is ready"

#### Error State - Initialization Failed
**When to show:** VA Profile initialization fails

**Message guidance:**
- Explain what happened in plain language
- Provide actionable next steps
- Include contact information for help
- Don't use technical jargon

**Example:**
```
We're having trouble setting up your profile

We're sorry. We can't set up your profile right now. This could be because:
- Our system is temporarily unavailable
- There's a problem with your account information

What you can do:
• Wait a few minutes and refresh this page
• Try accessing your Personal Information first
• If this keeps happening, call us at 800-MyVA411 (800-698-2411)

[Try Again Button]
```

#### Error State - Missing Required Information
**When to show:** User doesn't meet requirements (not in MVI, etc.)

**Message guidance:**
- Explain eligibility requirements
- Guide user on how to become eligible
- Provide support contact

**Example:**
```
We need to verify your identity

To access your Profile, we need to verify your identity. 

[Verify Your Identity Button]

Having trouble? Call us at 800-MyVA411 (800-698-2411)
```

### Design Deliverables
- [ ] Loading state design (Initialization in progress)
- [ ] Error state design (Initialization failed - system error)
- [ ] Error state design (Initialization failed - user ineligible)
- [ ] Error state design (Service unavailable)
- [ ] Message copy for each state
- [ ] Interaction design (retry behavior, button placement)
- [ ] Component specifications for developers

### Acceptance Criteria
- [ ] Designs reviewed and approved
- [ ] Copy reviewed for plain language and accessibility
- [ ] Design system components identified or created
- [ ] Implementation tickets created from designs

### Questions for Design
1. Should we show a "first time setup" message proactively?
2. How long should we show loading before suggesting something's wrong?
3. Should initialization happen in a modal/overlay or inline?
4. What retry strategy (manual button vs auto-retry)?

### Related Issues
- Issue #1, #2: Frontend implementation will use these designs
- Issue #5: If backend auto-initializes, may reduce need for error states

### Related Documentation
See `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for full analysis

---

## QA Planning

### Do we need a separate QA ticket? 
**Yes** - QA should be involved in:
1. Testing the fixes for Issues #1 and #2
2. Comprehensive audit from Issue #3
3. Validation that all entry points work correctly

### Who can validate this ticket?
- **FE**: Can validate Issues #1, #2, #3 (frontend changes)
- **BE**: Can validate Issues #4, #5 (backend documentation and design)
- **Design**: Can validate Issue #6 (UX improvements)
- **QA**: Should validate all issues end-to-end
- **PM**: Should review overall solution approach

### How can this work be validated?

#### Issue #1 & #2 Validation (FE Changes)
**Test Scenario: New User Flow**
1. Create/use test user: LOA3, in MVI, NO VA Profile ID
2. Navigate directly to `/profile/notifications`
3. Verify: Initialization happens automatically
4. Verify: Page loads successfully without errors
5. Repeat for `/profile/military-information`

**Test Scenario: Existing User Flow**
1. Use test user: LOA3, in MVI, HAS VA Profile ID
2. Navigate to each Profile page
3. Verify: No regression, pages work as before
4. Verify: No unnecessary initialization calls

**Test Scenario: Error Handling**
1. Mock VA Profile service failure
2. Navigate to Notification Settings
3. Verify: Appropriate error message shown
4. Verify: Retry mechanism works

#### Issue #3 Validation (FE Audit)
**Test Scenario: Comprehensive Page Audit**
1. For each Profile page:
   - Access with user without VA Profile ID
   - Verify either initializes or doesn't need to
   - Verify no unexpected errors
2. Document findings
3. Confirm all pages tested

#### Issue #4 & #5 Validation (BE Documentation)
1. Review documentation completeness
2. Verify accuracy by testing endpoints
3. Confirm with frontend team docs are clear
4. Test scenarios described in documentation

#### Issue #6 Validation (UX)
1. Review designs with stakeholders
2. Test with real users (if possible)
3. Verify messages are clear and actionable
4. Confirm implementation matches designs

### What updates need to be made?

#### Product Outline
- Document VA Profile ID initialization requirement
- Add troubleshooting section for initialization errors
- Update architecture documentation

#### Use Cases
- Add use case: "First-time user accesses Profile"
- Add use case: "User without VA Profile ID accesses subpage"
- Document expected behavior for each scenario

#### Contact Center Guide
- Add section on VA Profile initialization
- Include troubleshooting steps for initialization errors
- Add scripts for common user questions:
  - "I'm seeing an error when I access my Profile"
  - "The page says it's setting up my profile"
  - "What is a VA Profile ID?"

#### Documentation Updates
- Update developer onboarding docs
- Add VA Profile initialization to architecture docs
- Update API documentation (from Issue #4)
- Create runbook for common issues

---

**Document created:** November 11, 2025  
**Last updated:** November 11, 2025  
**Status:** Ready for ticket creation in GitHub
