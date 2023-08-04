/* eslint-disable no-console */
/* eslint-disable camelcase */

const core = require('@actions/core');

const E2E_BLOCKED_PATHS = [
  'src/applications/edu-benefits/1990n/tests/e2e/edu-1990n.cypress.spec.js',
  'src/applications/edu-benefits/1990e/tests/e2e/edu-1990e.cypress.spec.js',
  'src/applications/edu-benefits/1990/tests/e2e/edu-1990.cypress.spec.js',
  'src/applications/edu-benefits/5490/tests/e2e/edu-5490.cypress.spec.js',
  'src/applications/edu-benefits/1995/tests/e2e/edu-1995.cypress.spec.js',
  'src/applications/edu-benefits/5495/tests/e2e/edu-5495.cypress.spec.js',
  'src/applications/simple-forms/21-4142/tests/e2e/4142-medial-release.cypress.spec.js',
];
const ALLOW_LIST = [
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/edit/edit.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/hca/tests/e2e/hca-remove-pii-fields.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/facility-locator/tests/e2e/ccpDisabled.cypress.spec.js',
    allowed: true,
    titles: [
      'Does not render community care option in the dropdown, flag set to true',
    ],
    disallowed_at: '2022-09-20T21:20:11.932Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/edu-benefits/0993/tests/e2e/00.0993-opt-out.cypress.spec.js',
    allowed: true,
    titles: ['Fills out the form and submits'],
    disallowed_at: '2022-09-21T17:55:48.562Z',
    warned_at: null,
  },
  {
    spec_path: 'src/applications/hca/tests/e2e/hca-shortform.cypress.spec.js',
    allowed: true,
    titles: ['works with total disability rating greater than or equal to 50%'],
    disallowed_at: '2022-09-21T17:55:51.011Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/disability-benefits/all-claims/tests/all-claims-wizard.cypress.spec.js',
    allowed: true,
    titles: ['should show BDD questions & start button'],
    disallowed_at: '2022-09-27T17:06:40.306Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/update-skip-path/skip.demographics.path.cypress.spec.js',
    allowed: false,
    titles: [
      'skip demographics, update , update emergency contact and next of kin path',
    ],
    disallowed_at: '2022-11-18T22:58:23.226Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/analytics/passing.checkInType.cypress.spec.js',
    allowed: false,
    titles: ['Sending checkInType for pre-check-in App'],
    disallowed_at: '2022-11-18T22:59:04.733Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/happy-path/happy-path.already.completed.cypress.spec.js',
    allowed: false,
    titles: ['Pre-checkin skipped when already completed'],
    disallowed_at: '2022-11-18T22:59:13.741Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/requires-form/session.reloads.on.refresh.cypress.spec.js',
    allowed: false,
    titles: [
      'On page reload, on verify, this should redirect to the landing page',
    ],
    disallowed_at: '2022-11-18T22:59:16.093Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/posting-answers/answered.yes.to.three.questions.cypress.spec.js',
    allowed: false,
    titles: ['Answered yes to both questions'],
    disallowed_at: '2022-11-18T22:59:20.325Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/update-skip-path/update.all.path.cypress.spec.js',
    allowed: false,
    titles: ['update demographics && emergency contact && next of kin'],
    disallowed_at: '2022-11-18T22:59:33.464Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/update-skip-path/skip.all.path.cypress.spec.js',
    allowed: false,
    titles: ['skip demographics, next of kin, and emergency contact'],
    disallowed_at: '2022-11-18T22:59:37.653Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/session/session.reloads.on.refresh.cypress.spec.js',
    allowed: false,
    titles: [
      'On page reload, the data should be pull from session storage and redirected to landing screen with data loaded',
    ],
    disallowed_at: '2022-11-18T23:00:10.563Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/routing/browser.back.button.cypress.spec.js',
    allowed: false,
    titles: ['Browser back button still works with routing'],
    disallowed_at: '2022-11-18T23:00:12.742Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/intro-display/accordion.toggle.cypress.spec.js',
    allowed: false,
    titles: ['accordion opens and closes'],
    disallowed_at: '2022-11-18T23:00:15.422Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/back-button/back.button.cypress.spec.js',
    allowed: false,
    titles: ['Happy Path w/Emergency Contact'],
    disallowed_at: '2022-11-18T23:00:22.540Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/update-skip-path/skip.emergency.contact.path.cypress.spec.js',
    allowed: false,
    titles: [
      'update demographics, update next of kin path, and skip emergency contact',
    ],
    disallowed_at: '2022-11-18T23:00:33.782Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/update-skip-path/skip.next.of.kin.path.cypress.spec.js',
    allowed: false,
    titles: [
      'update demographics, skip next of kin path, and update emergency contact',
    ],
    disallowed_at: '2022-11-18T23:00:36.284Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/static-pages/homepage/tests/new-homepage.cypress.spec.js',
    allowed: false,
    titles: ['loads page with expected sections'],
    disallowed_at: '2022-12-14T05:58:29.404Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/my-education-benefits/tests/e2e/00-meb-all-fields.cypress.spec.js',
    allowed: false,
    titles: ['Your information page fields are prefilled'],
    disallowed_at: '2023-01-06T17:11:59.326Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/platform/site-wide/mega-menu/tests/megaMenu.cypress.spec.js',
    allowed: false,
    titles: ['looks as expected unauthenticated - C12293'],
    disallowed_at: '2023-01-23T08:08:36.824Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/education-letters/tests/e2e/00-letters-all-fields.cypress.spec.js',
    allowed: false,
    titles: [
      'All texts are present for the letters page authenticated but no letter',
    ],
    disallowed_at: '2023-01-30T18:34:12.599Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/disability-benefits/all-claims/tests/all-claims-keyboard-only.cypress.spec.js',
    allowed: false,
    titles: ['navigate through a maximal form'],
    disallowed_at: '2023-01-30T23:02:01.642Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/enrollment-verification/tests/e2e/00-ev-prefill-and-submit.cypress.spec.js',
    allowed: false,
    titles: ['All texts are present for the - claimant two months not updated'],
    disallowed_at: '2023-02-01T08:19:28.857Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/dhp-connected-devices/tests/dhp-consent-flow.cypress.spec.js',
    allowed: false,
    titles: [
      "displays login modal after clicking 'Sign in or create an account' for veteran NOT logged in",
    ],
    disallowed_at: '2023-02-28T18:09:29.505Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/coronavirus-vaccination/tests/e2e/hideauth.cypress.spec.js',
    allowed: false,
    titles: ['should launch app from the continue button'],
    disallowed_at: '2023-03-20T21:14:46.021Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/coronavirus-vaccination/tests/e2e/signup.cypress.spec.js',
    allowed: false,
    titles: ['should successfully submit the vaccine preparation form'],
    disallowed_at: '2023-03-20T21:14:48.453Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/post-delete-mobile-phone-alert.cypress.spec.js',
    allowed: false,
    titles: ['should be shown after deleting mobile phone number'],
    disallowed_at: '2023-04-06T06:53:38.294Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/debt-letters/tests/e2e/diary-codes-content.cypress.spec.js',
    allowed: false,
    titles: [
      'renders expected content for diary code: 080, 850, 852, 860, 855',
    ],
    disallowed_at: '2023-04-07T18:59:38.961Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/medical-copays/tests/e2e/cdp-alert.cypress.spec.js',
    allowed: false,
    titles: [
      'should display alert error message for VHA 404 response and Your Other VA section',
    ],
    disallowed_at: '2023-04-13T06:30:20.633Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/landing-page/tests/mhv-landing-page.cypress.spec.js',
    allowed: false,
    titles: ['An uncaught error was detected outside of a test'],
    disallowed_at: '2023-04-26T16:32:56.790Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/personalization/dashboard/tests/e2e/loa1.cypress.spec.js',
    allowed: false,
    titles: [
      'should handle LOA1 users at desktop size',
      'should handle LOA1 users at mobile phone size',
    ],
    disallowed_at: '2023-05-11T22:28:41.340Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/appeals/10182/tests/10182-keyboard-only.cypress.spec.js',
    allowed: false,
    titles: ['navigates through a maximal form'],
    disallowed_at: '2023-05-12T06:54:22.277Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/appeals/996/tests/hlr-keyboard-only.cypress.spec.js',
    allowed: false,
    titles: ['keyboard navigates through a maximal form'],
    disallowed_at: '2023-05-12T06:54:36.963Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messsaging-keyboard-nav-to-message-draft.cypress.spec.js',
    allowed: false,
    titles: [' Delete Drafts on key press'],
    disallowed_at: '2023-05-29T06:13:08.385Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messaging-keyboard-nav-to-move-message-from-custom-folder.cypress.spec.js',
    allowed: false,
    titles: ['move message'],
    disallowed_at: '2023-05-31T06:33:26.838Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/personalization/dashboard/tests/e2e/benefit-payments-v2.cypress.spec.js',
    allowed: false,
    titles: [
      'the v2 dashboard shows up - C22832',
      'the v2 dashboard should show up - C22831',
    ],
    disallowed_at: '2023-06-02T17:42:22.580Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-delete-draft.cypress.spec.js',
    allowed: false,
    titles: [' Delete Drafts'],
    disallowed_at: '2023-06-07T22:17:46.904Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-message-details-button-check.cypress.spec.js',
    allowed: false,
    titles: ['Message Details Buttons Check'],
    disallowed_at: '2023-06-09T07:21:19.115Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-edit-folder-name.cypress.spec.js',
    allowed: false,
    titles: ['Axe Check Custom Folder List'],
    disallowed_at: '2023-06-13T07:55:39.729Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messaging-compose-nav-validate-category.cypress.spec.js',
    allowed: false,
    titles: ['selects a category'],
    disallowed_at: '2023-06-14T07:19:14.836Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messaging-keyboard-nav-save-draft.cypress.spec.js',
    allowed: false,
    titles: ['Check confirmation message after save draft'],
    disallowed_at: '2023-06-14T16:40:28.962Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-manage-folder.cypress.spec.js',
    allowed: false,
    titles: ['Check Delete Folder Success'],
    disallowed_at: '2023-06-15T06:22:03.738Z',
    warned_at: '2023-08-01T13:55:15.112Z',
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-compose-reply-with-attachment.cypress.spec.js',
    allowed: false,
    titles: ['start a new message with attachment'],
    disallowed_at: '2023-06-21T08:46:21.059Z',
    warned_at: null,
  },
  {
    spec_path: 'src/applications/toe/tests/e2e/00-toe-prefill.cypress.spec.js',
    allowed: false,
    titles: [
      'Toe direct deposit page fields are prefilled, text and page elements verified',
      'Toe application review page fields are prefilled, text and page elements verified',
    ],
    disallowed_at: '2023-06-21T08:46:23.518Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/income-limits/tests/income-limits.cypress.spec.js',
    allowed: false,
    titles: [
      'navigates correctly through editing zip code',
      'navigates correctly through editing dependents',
    ],
    disallowed_at: '2023-06-22T17:41:27.502Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/static-pages/dependency-verification/tests/dependency-verification.cypress.spec.js',
    allowed: false,
    titles: [
      'should display a confirmation message when diaries have been updated',
    ],
    disallowed_at: '2023-07-12T06:13:21.207Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-draft-autosave.cypress.spec.js',
    allowed: false,
    titles: ['Check all draft messages contain the searched category'],
    disallowed_at: '2023-07-18T17:22:49.905Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/vaos/tests/e2e/flows/community-care.cypress.spec.js',
    allowed: false,
    titles: ['should submit request successfully'],
    disallowed_at: '2023-07-18T18:05:02.510Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-draft-save-with-attachments.cypress.spec.js',
    allowed: false,
    titles: ['Axe Check Draft Save with Attachments'],
    disallowed_at: '2023-07-19T17:58:01.669Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-compose-no-provider.cypress.spec.js',
    allowed: false,
    titles: ['can send message'],
    disallowed_at: '2023-07-24T05:43:07.131Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-compose-recipients-dropdown.cypress.spec.js',
    allowed: false,
    titles: ['preferredTriageTeam selcet dropdown default '],
    disallowed_at: '2023-07-24T05:43:09.163Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-delete-reply-draft.cypress.spec.js',
    allowed: false,
    titles: ['Axe Check Message Reply'],
    disallowed_at: '2023-07-25T06:59:25.073Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/vaos/tests/e2e/flows/appointment-list.cypress.spec.js',
    allowed: false,
    titles: [
      'should render upcoming appointments list',
      'should navigate to upcoming appointment details',
    ],
    disallowed_at: '2023-08-03T06:45:49.944Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-sent-folder.cypress.spec.js',
    allowed: false,
    titles: ['Check sorting works properly'],
    disallowed_at: '2023-08-03T16:37:38.618Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/financial-status-report/tests/e2e/fsr-5655-fetchDebts-filter.cypress.spec.js',
    allowed: false,
    titles: ['Successful API Response'],
    disallowed_at: '2023-08-03T17:14:04.715Z',
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messaging-keyboard-nav-to-attachments-compose-page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path: 'src/applications/appeals/996/tests/hlr.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/claims-status/tests/e2e/01.claim-status-decision.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/keyboard-nav-test/secure-messaging-keyboard-nav-to-links-buttons-landing-page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path: 'src/applications/letters/tests/01-authed.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-inbox-no-messages.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/already-validated-user/returning.user.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/appointments-display/appointment.eligible.status.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/contact-information/mailing-address.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/app-reload/reload.page.error.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/contact-information/focus-management.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/errors/check-in-failed.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/errors/render-error-is-caught/catching.render.error.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/financial-status-report/tests/e2e/fsr-5655-alert-cards-combined.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/hca/tests/e2e/hca-household-v2.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/update-skip-path/update.next.of.kin.only.path.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/notification-settings/happy-editing-path.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/secure-messaging/tests/e2e/secure-messaging-message-thread-detail-reply-page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/appointments-display/already.checked.in.appointment.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/profile.mpi-error.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/vre/28-1900/tests/e2e/chapter31-loa1.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/contact-information/vap-error.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path: 'src/applications/messages/tests/messages.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/personal-information/personal-info-disability-rating.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/appointments-display/appointment.page.is.refreshed.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/dashboard/tests/e2e/health-care-cerner.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/errors/post-pre-check-in/non.200.status.code.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/financial-status-report/tests/e2e/fsr-5655-fetchDebts-success.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/notification-settings/missing-contact-info-mobile.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/tests/e2e/screenshots/screenshots-current.day-of.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/debt-letters/tests/e2e/cdp-alert.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/direct-deposit/update-flow-cnp-with-lighthouse.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path: 'src/applications/login/tests/00.login-page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/appointments-display/appointment.too.early.status.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/static-pages/download-1095b/tests/01-1095b-authed.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/confirmation-display/confirmation.display.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/session/no.session.on.completion.page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/personalization/profile/tests/e2e/nametag.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/claims-status/tests/e2e/05.claim-additional-evidence.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/pre-check-in/tests/e2e/errors/get-pre-check-in/error.in.body.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/static-pages/health-care-manage-benefits/schedule-view-va-appointments-page/tests/index.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/check-in/day-of/tests/e2e/appointments-display/posting.appointment.data.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
  {
    spec_path:
      'src/applications/mhv/medications/tests/e2e/medications-dropdown-list-page.cypress.spec.js',
    allowed: true,
    titles: [],
    disallowed_at: null,
    warned_at: null,
  },
];

// const E2E_BLOCKED_PATHS = JSON.parse(process.env.E2E_BLOCKED_PATHS);
// const ALLOW_LIST = JSON.parse(process.env.ALLOW_LIST);

console.log('blocked paths', E2E_BLOCKED_PATHS);
console.log('allow list: ', ALLOW_LIST);

const warningsExistPastLimit = ALLOW_LIST.some(
  entry =>
    E2E_BLOCKED_PATHS.indexOf(entry.spec_path) > -1 && entry.allowed === false,
);

if (warningsExistPastLimit) {
  core.setFailed(
    `One or more directories contain tests that have been disabled for a total exceeding 90 days. Merging is blocked until all warnings are cleared. The paths in question are: ${E2E_BLOCKED_PATHS}`,
  );
  process.exit(1);
}
