## TODO (form 0996 HLR)

### After API available

- Update `IntroductionPage.jsx`
  - [x] Replace placeholder `isInLegacySystem` with value from API
  - [x] Add code to update `isInLegacySystem` (or whatever it's named).
-  Update `OptOutFromLegacySystem.jsx`
  - [x] Consider converting the `OptOutFromLegacySystem` component into a
        standalone form with it's own form schema - suggested by Erik Hansen.
- Update `form.js`
  - [ ] Add `submitUrl`.
  - [ ] Update `formConfig.submit` (`confirmationNumber`?)
- [ ] Add flipper UI switch.
- [ ] Check if we're using an approved route for the form:
  `/disability-benefits/apply/form-0996-higher-level-review/`; see
  https://github.com/department-of-veterans-affairs/va.gov-team/issues/1984

### Build Template & Introduction Page (Step 0)

- [x] Build template.
- [x] Include saved form data component.
- [x] Update checkbox error message (needs content approval).
- [x] URL destination for the "Learn more about the review options" link?
      Currently it is pointing to `/decision-reviews`.
- [x] Destination or component that opens when the "See all your contested
      issues" link is used.

### Confirm Veteran Details (Step 1)

- [x] Build form `confirmVeteranDetails` in `config/form.js`
- [ ] Get last 4 of SSN? Look for API entry.
- [x] Auto-fill contact info review (collapsed with edit button? - talk to design)
- [x] Add unit tests
- [ ] Add e2e tests

### Select your contested issues (Step 2a & b)

- [x] Build form `selectContestedIssues` in `config/form.js`
- [ ] Get eligible issues API call?
- [x] Desination of "See all your issues" link?
- [x] Add unit tests
- [ ] Add e2e tests

### Same jurisdiction & add notes (Step 2c)

- [x] Build form `addNotes` in `config/form.js`
- [x] Add note for relevant evidence
- [x] Add unit tests
- [ ] Add e2e tests

### Office of review (Step 3)

- [x] Choose same regional office yes/no
- [x] Add unit tests
- [ ] Add e2e tests

### Request an informal conference (Step 4)

- [x] Build form `requestAnInformalConference` in `config/form.js`
- [x] Awaiting design on "Weekday" dropdown content - remove
- [x] Applied step 3 redesign
- [x] Add unit tests
- [ ] Add e2e tests

### Submit your application (Step 5)

- [x] Is there a design? This page was automaticaly added by the form builder.
- [x] Change wording to be "Review and submit your
      application", can it be changed to match the design?)
- [x] Add privacy policy check
- [ ] Add unit tests
- [ ] Add e2e tests

### Confirmation page

- [x] Update pre-built page from design
- [x] Update link "after you apply" when available
- [x] Add unit tests
- [ ] Add e2e tests

### Move opt out page

- [x] ~Opt out page should only be visible if user has a legacy appeal~ - N/A, always visible now
- [x] Consider updating JSON form schema library to accept an option to add an
      opt out/in page after the introduction page

### Before Production
- [ ] Check for, and remove, all console logs.
- [x] Move `20-0996-schema.json` to `vets-json-schema` repo.
- [ ] Ensure matching tracking prefixes (if changed)
  - `src/applications/disability-benefits/996/config/form.js` in `formConfig.trackingPrefix`.
  - `src/applications/personalization/dashboard/helpers.jsx` ~line 146
- [ ] Clear production flag in `config/form.js`.
- [ ] Delete this to-do file.
- [ ] Add e2e tests (only executes on production pages?)

#### Review
- [ ] QA review - Tze
- [ ] 508 internal review - Trevor & Jennifer
  - https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/accessibility/review-process.md
  - https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/teams/vsa/teams/ebenefits/508-checklist-wip.md
- [ ] Google analytics
- [ ] Load testing
- [ ] Wrap in downtime notification
- [ ] Notify `#vsp-contact-center-support` about release and go over
      troubleshooting any issues
