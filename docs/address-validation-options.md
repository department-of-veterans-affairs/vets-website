# Address Validation Options — Quick Reference

A concise reference of the seven address-validation approaches discovered in the codebase, with links, pros, cons, and guidance on when to use each.

---

## 1. Ask VA
- **Code:** [src/applications/ask-va/components/FormFields/AddressValidationRadio.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/ask-va/components/FormFields/AddressValidationRadio.jsx)
- **Pros:** Works for unauthenticated users; simple radio UI for suggestions; lightweight; falls back to user-entered address.
- **Cons:** Minimal UX (no modal); custom to the Ask VA flow — not a reusable platform component; direct API calls may require API key when calling the staging/production API.
- **When to use:** Unauthenticated form pages that need a quick suggestion UI without profile integration.

## 2. Letters (Profile / VAP-SVC reuse)
- **Code:** [src/applications/letters/containers/EditAddress.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/letters/containers/EditAddress.jsx)
- **Pros:** Reuses platform `vap-svc` components; consistent profile UX; handles profile transactions and analytics.
- **Cons:** Profile-centric (assumes `vapService` reducer present); heavier integration and state management.
- **When to use:** Authenticated flows where address updates should persist to the user's VA Profile.

## 3. Profile Contact Information (VAP-SVC canonical)
- **Code:** [src/applications/personalization/profile/components/contact-information/ContactInformation.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/personalization/profile/components/contact-information/ContactInformation.jsx)
- **Pros:** Canonical, full-featured implementation; modal suggestions; transaction polling and analytics; robust.
- **Cons:** Complex; tightly coupled to authenticated profile and `vapService` redux state.
- **When to use:** Any profile edit where authoritative saving to VA Profile is required.

## 4. Profile Direct Deposit (VYE) — custom
- **Code (UI):** [src/applications/personalization/profile/components/direct-deposit/vye/components/SuggestedAddress.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/personalization/profile/components/direct-deposit/vye/components/SuggestedAddress.jsx)
- **Code (reducer):** [src/applications/personalization/profile/components/direct-deposit/vye/reducers/addressValidation.js](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/personalization/profile/components/direct-deposit/vye/reducers/addressValidation.js)
- **Pros:** Tailored UX for VYE; independent state/reducer allows custom behavior and flow control.
- **Cons:** Duplicates logic separate from `vap-svc`; increased maintenance surface.
- **When to use:** Complex, specialized flows that need bespoke UX/flow control.

## 5. Pre-need integration (AddressConfirmation)
- **Code:** [src/applications/pre-need-integration/components/AddressConfirmation.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/pre-need-integration/components/AddressConfirmation.jsx)
- **Pros:** Simple confirm UI for unauthenticated applicants; used across applicant/preparer/sponsor pages; lightweight.
- **Cons:** Limited to confirmation messaging (no modal suggestions UI); relies on other helpers to call the address validation API.
- **When to use:** Unauthenticated multi-party forms that only need to warn users and let them confirm or edit.

## 6. Verify Your Enrollment (VYE app)
- **Code (UI):** [src/applications/verify-your-enrollment/components/SuggestedAddress.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/verify-your-enrollment/components/SuggestedAddress.jsx)
- **Code (container):** [src/applications/verify-your-enrollment/containers/ChangeOfAddressWrapper.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/verify-your-enrollment/containers/ChangeOfAddressWrapper.jsx)
- **Code (reducer):** [src/applications/verify-your-enrollment/reducers/addressValidation.js](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/verify-your-enrollment/reducers/addressValidation.js)
- **Pros:** Full suggested-address flow for unauthenticated or partial-auth flows; its own reducers/actions provide fine-grained control.
- **Cons:** Separate implementation from platform canonical flow; extra maintenance.
- **When to use:** Enrollment flows where suggested-address UX and profile-update actions are needed without full profile integration.

## 7. Forms-system / Platform VAP-SVC (core)
- **Code (actions/thunks):** [src/platform/user/profile/vap-svc/actions/transactions.js](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/user/profile/vap-svc/actions/transactions.js)
- **Code (modal/view):** [src/platform/user/profile/vap-svc/containers/AddressValidationView.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/user/profile/vap-svc/containers/AddressValidationView.jsx)
- **Code (controller):** [src/platform/user/profile/vap-svc/components/ProfileInformationFieldController.jsx](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/user/profile/vap-svc/components/ProfileInformationFieldController.jsx)
- **Code (reducer/util):** [src/platform/user/profile/vap-svc/reducers/index.js](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/user/profile/vap-svc/reducers/index.js) | [src/platform/user/profile/vap-svc/util/index.js](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/user/profile/vap-svc/util/index.js)
- **Pros:** Canonical, reusable, comprehensive; handles suggestions, override keys, transactions, analytics, and modal UX consistently across the platform.
- **Cons:** Auth/profile-centric; heavier to extract or decouple for unauthenticated forms; requires `vapService` reducer and transaction handling.
- **When to use:** Authenticated/profile-edit experiences where consistency and persistence to VA Profile are required.

---

If you want, I can also add a short decision matrix (auth vs unauth, need to persist to profile, UX complexity) or post this as a comment draft to the original GitHub issue. Which would you prefer?
