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
- [ ] URL destination for the "Learn more about the review options" link?
      Currently it is pointing to `/decision-reviews`.
- [ ] Destination or component that opens when the "See all your contested
      issues" link is used.

### Confirm Veteran Details (Step 1)

- [x] Build form `confirmVeteranDetails` in `config/form.js`
- [ ] Get last 4 of SSN? Look for API entry.
- [x] Auto-fill contact info review (collapsed with edit button? - talk to design)
- [ ] Add tests

### Select your contested issues (Step 2a & b)

- [ ] Build form `selectContestedIssues` in `config/form.js`
- [ ] Get eligible issues API call?
- [ ] Desination of "See all your issues" click?
- [ ] Add tests

### Same jurisdiction & add notes (Step 2c)

- [ ] Build form `addNotes` in `config/form.js`
- [ ] Choose same regional office yes/no
- [ ] Add note for reviewer
- [ ] Add tests

### Request an informal conference (Step 3)

- [ ] Build form `requestAnInformalConference` in `config/form.js`
- [ ] Awaiting design on "Weekday" dropdown content
- [ ] Add tests

### Submit your application (Step 4)

- [ ] Build form in ?? (wording appears to be "Review and submit your
      application", can it be changed to match the design?)
- [ ] Add privacy policy check
- [ ] Add tests

### Confirmation page

- [ ] Is there a design? This page was automaticaly added by the form builder.
- [ ] Add tests

### Swap order of intro & opt out page

- [ ] Opt out page should only be visible if user has a legacy appeal
- [ ] Consider updating JSON form schema library to accept an option to add an
      opt out/in page after the introduction page

### Before Production
- [ ] Check for, and remove, all console logs.
- [ ] Move `20-0996-schema.json` to `vets-json-schema` repo.
- [ ] Ensure matching tracking prefixes (if changed)
  - `src/applications/disability-benefits/996/config/form.js` in `formConfig.trackingPrefix`.
  - `src/applications/personalization/dashboard/helpers.jsx` ~line 146
- [ ] Clear production flag in `config/form.js`.
- [ ] Delete this to-do file.
- [ ] Add e2e tests (only executes on production pages?)

