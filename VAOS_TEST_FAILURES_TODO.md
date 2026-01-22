# VAOS Unit Test CI Failures - TODO

These tests pass locally but were failing on CI. The common pattern is timing-related issues where tests use `waitFor` or `waitForElementToBeRemoved` in ways that are fragile to CI timing variations.

## Fixed (in this PR)

### RequestedAppointmentDetailsPage (3 failures) - FIXED
File: `src/applications/vaos/appointment-list/pages/RequestedAppointmentDetailsPage/RequestedAppointmentDetailsPage.unit.spec.jsx`

- [x] **1. should display pending document title**
- [x] **2. should display CC document title**  
- [x] **3. should display cancel document title**
- [x] **4. should show error message when single fetch errors** (fixed earlier)

Fix: Wait for h1 heading using `findByRole` before checking `document.title`.

### UpcomingAppointmentsDetailsPage/ConfirmedAppointmentDetailsPage (14 failures) - FIXED
File: `src/applications/vaos/appointment-list/pages/UpcomingAppointmentsDetailsPage/index.unit.spec.jsx`

- [x] **4-6. Focus and cancellation display tests**
  - should display who canceled the appointment
  - should display who canceled the appointment for past appointments
  - should allow the user to go back to the appointment list

- [x] **7-17. Document title tests** (11 tests)
  - All document title tests for ATLAS, video, video at VA location, phone, and CC appointments

Fix: Wait for h1 heading using `findByRole` before checking `document.activeElement` or `document.title`.

### ReviewAndConfirm (1 failure) - FIXED (earlier)
File: `src/applications/vaos/referral-appointments/ReviewAndConfirm.unit.spec.jsx`

- [x] **31. should display an error message when new draft appointment creation fails**

Fix: Replaced `waitForElementToBeRemoved` with `waitFor` for expected error element.

## Remaining Items to Monitor on CI

The following tests pass locally but may still need attention if they fail on CI:

### NewBookingSection (1 failure) - NEEDS CI VERIFICATION
File: `src/applications/vaos/covid-19-vaccine/index.unit.spec.jsx`

- [ ] **18. should show error when facility availability check fails**
  - Test uses `await screen.findByRole()` - should work but needs CI verification

### CommunityCareProviderSelectionPage (4 failures) - NEEDS CI VERIFICATION
File: `src/applications/vaos/new-appointment/components/CommunityCareProviderSelectionPage/index.unit.spec.jsx`

- [ ] **19-22. Geolocation and provider sorting tests**
  - Tests rely on geolocation mocking - needs CI verification

### DateTimeSelectPage (1 failure) - NEEDS CI VERIFICATION
File: `src/applications/vaos/new-appointment/components/DateTimeSelectPage/index.unit.spec.jsx`

- [ ] **23. should adjust look and feel by screen size**
  - Uses proper guard for `waitForElementToBeRemoved` - needs CI verification

### ChooseDateAndTime (1 failure) - NEEDS CI VERIFICATION
File: `src/applications/vaos/referral-appointments/ChooseDateAndTime.unit.spec.jsx`

- [ ] **24. should show error if any fetch fails**
  - Needs CI verification

### ReviewAndConfirm (4 more failures) - NEEDS CI VERIFICATION
File: `src/applications/vaos/referral-appointments/ReviewAndConfirm.unit.spec.jsx`

- [ ] **25-29. Various ReviewAndConfirm tests**
  - Needs CI verification

---

## Summary

**All 899 VAOS tests pass locally (28 pending/skipped).**

**Fixes Applied:**
1. Wait for h1 heading before checking document.title or document.activeElement
2. Use `findByRole` to ensure elements exist before asserting on focus/title
3. Replace `waitForElementToBeRemoved` with `waitFor` for error elements

---

## Common Fix Patterns

1. **Replace `waitForElementToBeRemoved` with `waitFor`**: When waiting for a loading state to finish, wait for the expected final element instead of waiting for the loading element to disappear.

2. **Use `await screen.findByX()` instead of `screen.getByX()`**: The `findBy*` methods automatically wait for elements.

3. **Increase timeout for `waitFor`**: Some tests may need longer timeouts on CI: `waitFor(() => {...}, { timeout: 5000 })`

4. **Check element presence before removal**: If using `waitForElementToBeRemoved`, first check if element exists:
   ```js
   const loading = screen.queryByTestId('loading');
   if (loading) {
     await waitForElementToBeRemoved(() => screen.queryByTestId('loading'));
   }
   ```

5. **Avoid racing conditions**: Ensure mocks are set up before component renders.

6. **Use `act()` wrapper**: For state updates that happen asynchronously.
