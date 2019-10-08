## TODO (form 0996 HLR)

### After API available

- Update `IntroductionPage.jsx`
  - [ ] Replace placeholder `isInLegacySystem` with value from API
  - [ ] Add code to update `isInLegacySystem` (or whatever it's named).
-  Update `WithdrawFromLegacySystem.jsx`
  - [ ] Consider converting the `WithdrawFromLegacySystem` component into a
        standalone form with it's own form schema - suggested by Erik Hansen.
- Update `form.js`
  - Add `submitUrl`.
  - Update `formConfig.submit` (`confirmationNumber`?)

### Build Template & Introduction Page (Step 0)

- [x] Build template.
- [x] Include saved form data component.
- [ ] Update checkbox error message (needs content approval).
- [ ] Given multiple entry points, where should the "Back" button lead? Is it
      bad form to use `history.back()`?
- [ ] URL destination for the "Learn more about the review options" link?
      Currently it is pointing to `/decision-reviews`.
- [ ] Destination or component that opens when the "See all your contested
      issues" link is used.

### Confirm Veteran Details (Step 1)

- [ ] Build form `confirmVeteranDetails` in `config/form.js`
- [ ] Get last 4 of SSN? Look for API entry.
- [ ] Auto-fill contact info review (collapsed with edit button? - talk to design)

### Select your contested issues (Step 2)

- [ ] Build form `selectContestedIssues` in `config/form.js`
- [ ] Get eligible issues API call?
- [ ] Desination of "See all your issues" click?

### Add notes (Step 3)

- [ ] Build form `addNotes` in `config/form.js`
- [ ] Awaiting design on if notes should be a textarea (not a blocker)
- [ ] Always show "You can't submit any evidence"?

### Request original jurisdiction (Step 4)

- [ ] Build form `requestOriginalJurisdiction` in `config/form.js`
- [ ] Blocked by design on how to deal with choosing regional office.

### Request an informal conference (Step 5)

- [ ] Build form `requestAnInformalConference` in `config/form.js`
- [ ] Awaiting design on "Weekday" dropdown content

### Submit your application (Step 6)

- [ ] Build form in ?? (wording appears to be "Review and submit your
      application", can it be changed to match the design?)
- [ ] Add privacy policy check

### Confirmation page

- [ ] Is there a design? This page was automaticaly added by the form builder.

### Before Production
- [ ] Check for, and remove, all console logs.
- [ ] Move `20-0996-schema.json` to `vets-json-schema` repo.
- [ ] Ensure matching tracking prefixes (if changed)
  - `src/applications/disability-benefits/996/config/form.js` in `formConfig.trackingPrefix`.
  - `src/applications/personalization/dashboard/helpers.jsx` ~line 146
- [ ] Clear production flag in `config/form.js`.
- [ ] Delete this to-do file.
