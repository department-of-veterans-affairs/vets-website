# Quick Reference: VA Profile ID Issue

## TL;DR

**Problem:** Notification Settings and Military Information pages fail for new LOA3 users until they visit Personal Information first.

**Root Cause:** These pages don't initialize VA Profile IDs, but backend requires them.

**Fix:** Wrap pages with `InitializeVAPServiceID` component (like Personal Information does).

---

## Quick Diagnosis

### User reports: "I get an error when I access Notification Settings"

**Check:**
1. Is user LOA3? (Verified identity)
2. Have they visited Personal Information before?
3. Is this their first time in Profile?

**If YES to all:** This is the VA Profile ID initialization issue.

**Workaround:** Have user visit Personal Information first.

---

## For Developers

### How to fix a page that needs VA Profile ID:

```jsx
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

// In your component:
<InitializeVAPServiceID>
  {/* Your page content here */}
</InitializeVAPServiceID>
```

### Pages that currently use it:
- ✅ Personal Information
- ✅ Contact Information
- ✅ Edit Contact Info modal

### Pages that need it:
- ❌ Notification Settings
- ❌ Military Information (possibly)

### How to check if your page needs it:

**Does your page call these endpoints?**
- `/profile/communication_preferences`
- `/profile/personal_information`
- `/profile/telephones`, `/profile/email_addresses`, `/profile/addresses`
- `/profile/preferred_names`, `/profile/gender_identities`

**Then YES, wrap with `InitializeVAPServiceID`**

---

## For Product/PM

**User Impact:** Medium
- New users see errors on first visit to certain pages
- Workaround exists (visit Personal Information first)
- Confusing UX but not blocking

**Fix Timeline:**
- Quick fix: 1 sprint (wrap pages)
- Full solution: 2-3 sprints (includes backend + UX)

**Priority:** P0 (user-facing bug)

---

## For QA

### Test Case: New User Without VA Profile ID

**Setup:**
- LOA3 user
- In MVI (has ICN)
- No VA Profile ID created yet

**Test:**
1. Navigate directly to `/profile/notifications`
2. **Expected:** Page initializes and loads successfully
3. **Bug:** System error is shown

**After Fix:**
1. Navigate directly to `/profile/notifications`
2. See "Setting up your profile..." message
3. Page loads successfully

### Test Case: Existing User With VA Profile ID

**Setup:**
- LOA3 user
- Already has VA Profile ID

**Test:**
1. Navigate to any Profile page
2. **Expected:** Page loads immediately (no initialization)
3. **Expected:** No regression

---

## Documentation

| File | Purpose |
|------|---------|
| `VA_PROFILE_ID_INVESTIGATION_SUMMARY.md` | Executive summary |
| `VA_PROFILE_ID_ISSUE_ANALYSIS.md` | Complete technical analysis |
| `FOLLOW_UP_TICKETS.md` | 6 GitHub issues ready to create |
| `QUICK_REFERENCE.md` | This file (quick lookup) |

---

## Tickets to Create

1. **[FE] Fix Notification Settings** - P0 Critical
2. **[FE] Fix Military Information** - P0 Critical  
3. **[FE] Audit all Profile pages** - P1 High
4. **[BE] Document endpoint requirements** - P1 High
5. **[BE] Consider auto-initialization** - P2 Medium
6. **[Design/UX] Improve error messages** - P1 High

---

## Common Questions

**Q: Why do some pages work and others don't?**  
A: Only pages that use `InitializeVAPServiceID` trigger VA Profile ID creation.

**Q: Why don't we initialize at the Profile root level?**  
A: We could! That's an option to consider (see Issue #5).

**Q: Can backend just auto-create the VA Profile ID?**  
A: That's being investigated (see Issue #5).

**Q: Is this a security issue?**  
A: No, it's a UX/implementation issue, not a security vulnerability.

**Q: How many users are affected?**  
A: Any LOA3 user accessing Notification Settings or Military Information before Personal Information.

---

## Contact

**Questions about this issue?**
- Check: `VA_PROFILE_ID_ISSUE_ANALYSIS.md` for details
- See: `FOLLOW_UP_TICKETS.md` for implementation tickets
- Team: Authenticated Experience (Profile team)

---

**Last updated:** November 11, 2025
