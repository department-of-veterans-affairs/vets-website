// import Timeouts from 'platform/testing/e2e/timeouts';

// // Read inside Shadow DOM for this spec
// Cypress.config('includeShadowDom', true);

// const baseUrl =
//   '/careers-employment/track-your-vre-benefits/vre-benefit-status';

// const buildCaseDetails = ({ stateList = [], overrides = {} } = {}) => ({
//   data: {
//     id: '123',
//     type: 'ch31_case_details',
//     attributes: {
//       resCaseId: 'A123',
//       orientationAppointmentDetails: null,
//       externalStatus: {
//         isDiscontinued: false,
//         discontinuedReason: null,
//         isInterrupted: false,
//         interruptedReason: null,
//         stateList,
//       },
//       ...overrides,
//     },
//   },
// });

// const stepStateList = step => [
//   { stepCode: 'APP', status: step === 1 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'ELIG', status: step === 2 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'ORIENTATION', status: step === 3 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'INTAKE', status: step === 4 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'ENTITLEMENT', status: step === 5 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'REHAB_PLAN', status: step === 6 ? 'ACTIVE' : 'COMPLETE' },
//   { stepCode: 'BENEFITS', status: step === 7 ? 'ACTIVE' : 'COMPLETE' },
// ];

// const discontinuedCaseDetails = buildCaseDetails({
//   stateList: [],
//   overrides: {
//     externalStatus: {
//       isDiscontinued: true,
//       discontinuedReason: 'No response from Veteran',
//       isInterrupted: false,
//       interruptedReason: null,
//       stateList: [],
//     },
//   },
// });

// const stubFeatureToggles = value =>
//   cy.intercept('GET', '**/v0/feature_toggles*', {
//     data: {
//       type: 'feature_toggles',
//       features: [{ name: 'vre_eligibility_status_phase_2_updates', value }],
//     },
//   });

// const stubCaseDetails = body =>
//   cy.intercept('GET', '**/vre/v0/ch31_case_details*', {
//     statusCode: 200,
//     body,
//   });

// describe('CH31 My Case Management Hub', () => {
//   beforeEach(() => {
//     cy.login();

//     cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
//   });

//   it('shows an unavailable message when the feature toggle is off', () => {
//     stubFeatureToggles(false).as('featureToggles');
//     stubCaseDetails(buildCaseDetails({ stateList: stepStateList(1) })).as(
//       'caseDetails',
//     );

//     cy.visit(baseUrl);

//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains('h1', /your vr&e benefit status/i, {
//       timeout: Timeouts.slow,
//     }).should('be.visible');
//     cy.contains(/page isn.?t available right now/i).should('be.visible');
//   });

//   const stepCases = [
//     {
//       step: 1,
//       label: 'application received',
//       copy: /received your application for vr&e benefits/i,
//     },
//     {
//       step: 2,
//       label: 'eligibility determination',
//       copy: /currently being reviewed for basic eligibility/i,
//     },
//     {
//       step: 5,
//       label: 'entitlement determination',
//       copy: /completing the entitlement determination review/i,
//     },
//     {
//       step: 6,
//       label: 'rehabilitation plan',
//       copy: /working with you to establish your chapter 31 rehabilitation plan or career track/i,
//     },
//     {
//       step: 7,
//       label: 'benefits initiated',
//       copy: /rehabilitation plan or career track has started/i,
//     },
//   ];

//   stepCases.forEach(({ step, label, copy }) => {
//     it(`renders the progress tracker for step ${step} (${label})`, () => {
//       stubFeatureToggles(true).as('featureToggles');
//       stubCaseDetails(buildCaseDetails({ stateList: stepStateList(step) })).as(
//         'caseDetails',
//       );

//       cy.visit(baseUrl);

//       cy.wait('@featureToggles', { timeout: 20000 });
//       cy.wait('@caseDetails', { timeout: 20000 });

//       cy.contains('h1', /your vr&e benefit status/i, {
//         timeout: Timeouts.slow,
//       }).should('be.visible');

//       if (step === 1) {
//         cy.injectAxeThenAxeCheck();
//       }

//       cy.get('va-segmented-progress-bar')
//         .should('have.attr', 'current', String(step))
//         .and('have.attr', 'total', '7');

//       cy.contains(copy).should('be.visible');
//       cy.get('va-need-help').should('exist');
//     });
//   });

//   it('shows a discontinued alert and hides the tracker', () => {
//     stubFeatureToggles(true).as('featureToggles');
//     stubCaseDetails(discontinuedCaseDetails).as('caseDetails');

//     cy.visit(baseUrl);

//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains('h1', /your vr&e benefit status/i, {
//       timeout: Timeouts.slow,
//     }).should('be.visible');
//     cy.contains(/your chapter 31 claim has been discontinued/i).should(
//       'be.visible',
//     );
//     cy.contains(/no response from veteran/i).should('be.visible');
//     cy.get('va-link-action')
//       .should('have.attr', 'text', 'View my letter')
//       .and('be.visible');
//     cy.get('va-segmented-progress-bar').should('not.exist');
//   });

//   it('shows a load failure alert when case details fail', () => {
//     stubFeatureToggles(true).as('featureToggles');
//     cy.intercept('GET', '**/vre/v0/ch31_case_details*', {
//       statusCode: 500,
//       body: {
//         errors: [{ status: '500', title: 'Server error' }],
//       },
//     }).as('caseDetails');

//     cy.visit(baseUrl);

//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains(/we can't load the case progress right now/i).should(
//       'be.visible',
//     );
//     cy.get('va-segmented-progress-bar').should('not.exist');
//   });
// });

// describe('CH31 My Case Management Hub - Step 3 (Orientation)', () => {
//   beforeEach(() => {
//     cy.login();
//     cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
//     stubFeatureToggles(true).as('featureToggles');
//     stubCaseDetails(buildCaseDetails({ stateList: stepStateList(3) })).as(
//       'caseDetails',
//     );
//     cy.visit(baseUrl);
//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });
//   });

//   it('renders the progress tracker at step 3', () => {
//     cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
//     cy.get('va-segmented-progress-bar').should('exist');
//     cy.contains(/orientation/i).should('be.visible');
//     cy.contains(
//       /choose between watching the va video orientation online or completing orientation during the initial evaluation/i,
//     ).should('be.visible');
//   });

//   it('shows radio options for orientation preference', () => {
//     cy.get('va-radio').should('exist');
//     cy.get('va-radio-option').should('have.length.at.least', 2);
//     cy.get('va-radio-option')
//       .eq(0)
//       .contains(/watch the va orientation video online/i);
//     cy.get('va-radio-option')
//       .eq(1)
//       .contains(
//         /complete orientation during the initial evaluation counselor meeting/i,
//       );
//   });

//   it('shows video attestation UI when "Watch the VA Orientation Video online" is selected', () => {
//     cy.get('va-radio-option')
//       .eq(0)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.contains(
//       /please watch the full video and self-certify upon completion/i,
//     ).should('be.visible');
//     cy.get('va-link')
//       .should('have.attr', 'href')
//       .and('include', 'youtube');
//     cy.get('va-checkbox').should('exist');
//     cy.get('va-button').should('exist');
//   });

//   it('shows error if trying to submit video attestation without checking the box', () => {
//     cy.get('va-radio-option')
//       .eq(0)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-button')
//       .find('button')
//       .click({ force: true });
//     cy.contains(
//       /you must acknowledge and attest that you have watched the video/i,
//     ).should('be.visible');
//   });

//   it('submits successfully when attestation is checked', () => {
//     cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
//       statusCode: 200,
//       body: { data: { id: '1', type: 'ch31_case_milestone' } },
//     }).as('submitMilestone');
//     cy.get('va-radio-option')
//       .eq(0)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-checkbox')
//       .find('input[type="checkbox"]')
//       .check({ force: true });
//     cy.get('va-button')
//       .find('button')
//       .click({ force: true });
//     cy.wait('@submitMilestone');
//     cy.contains(/your preference has been submitted/i).should('not.exist');
//   });

//   it('shows error alert if API fails on submit', () => {
//     cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
//       statusCode: 500,
//       body: {},
//     }).as('submitMilestone');
//     cy.get('va-radio-option')
//       .eq(0)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-checkbox')
//       .find('input[type="checkbox"]')
//       .check({ force: true });
//     cy.get('va-button')
//       .find('button')
//       .click({ force: true });
//     cy.wait('@submitMilestone');
//     cy.contains(
//       /something went wrong on our end while submitting your preference/i,
//     ).should('be.visible');
//   });

//   it('shows submit button for "Complete orientation during the Initial Evaluation Counselor Meeting"', () => {
//     cy.get('va-radio-option')
//       .eq(1)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-button').should('exist');
//   });

//   it('submits successfully when "Complete orientation during the Initial Evaluation Counselor Meeting" is selected', () => {
//     cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
//       statusCode: 200,
//       body: { data: { id: '1', type: 'ch31_case_milestone' } },
//     }).as('submitMilestone');
//     cy.get('va-radio-option')
//       .eq(1)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-button')
//       .find('button')
//       .click({ force: true });
//     cy.wait('@submitMilestone');
//     cy.contains(/your preference has been submitted/i).should('not.exist');
//   });

//   it('shows error alert if API fails for "Complete orientation during the Initial Evaluation Counselor Meeting"', () => {
//     cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
//       statusCode: 500,
//       body: {},
//     }).as('submitMilestone');
//     cy.get('va-radio-option')
//       .eq(1)
//       .find('input[type="radio"]')
//       .check({ force: true });
//     cy.get('va-button')
//       .find('button')
//       .click({ force: true });
//     cy.wait('@submitMilestone');
//     cy.contains(
//       /something went wrong on our end while submitting your preference/i,
//     ).should('be.visible');
//   });
// });

// describe('CH31 My Case Management Hub - Step 4 (Initial Evaluation Counselor Meeting)', () => {
//   beforeEach(() => {
//     cy.login();
//     cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
//     stubFeatureToggles(true).as('featureToggles');
//   });

//   it('renders the progress tracker at step 4 with scheduling instructions', () => {
//     stubCaseDetails(
//       buildCaseDetails({
//         stateList: stepStateList(4),
//         overrides: {
//           orientationAppointmentDetails: null,
//         },
//       }),
//     ).as('caseDetails');

//     cy.visit(baseUrl);
//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
//     cy.get('va-segmented-progress-bar')
//       .should('have.attr', 'current', '4')
//       .and('have.attr', 'total', '7');
//     cy.contains(
//       /check your email to schedule your meeting with your counselor/i,
//     ).should('be.visible');
//     cy.get('va-need-help').should('exist');
//   });

//   it('shows appointment scheduled message when appointment details are present', () => {
//     stubCaseDetails(
//       buildCaseDetails({
//         stateList: stepStateList(4),
//         overrides: {
//           orientationAppointmentDetails: {
//             appointmentDateTime: '2026-03-10T14:00:00Z',
//             appointmentPlace: 'VA Regional Office',
//           },
//         },
//       }),
//     ).as('caseDetails');

//     cy.visit(baseUrl);
//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
//     cy.get('va-segmented-progress-bar')
//       .should('have.attr', 'current', '4')
//       .and('have.attr', 'total', '7');
//     cy.contains(
//       /your initial evaluation appointment has been scheduled/i,
//     ).should('be.visible');
//     cy.contains(
//       /reschedule, use your appointment confirmation rescheduling link/i,
//     ).should('be.visible');
//     cy.get('va-need-help').should('exist');
//   });

//   it('shows discontinued alert and hides tracker at step 4', () => {
//     stubCaseDetails(
//       buildCaseDetails({
//         stateList: [],
//         overrides: {
//           externalStatus: {
//             isDiscontinued: true,
//             discontinuedReason: 'No response from Veteran',
//             isInterrupted: false,
//             interruptedReason: null,
//             stateList: [],
//           },
//         },
//       }),
//     ).as('caseDetails');

//     cy.visit(baseUrl);
//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains(/your chapter 31 claim has been discontinued/i).should(
//       'be.visible',
//     );
//     cy.contains(/no response from veteran/i).should('be.visible');
//     cy.get('va-segmented-progress-bar').should('not.exist');
//   });

//   it('shows error alert if API fails on step 4', () => {
//     cy.intercept('GET', '**/vre/v0/ch31_case_details*', {
//       statusCode: 500,
//       body: {
//         errors: [{ status: '500', title: 'Server error' }],
//       },
//     }).as('caseDetails');

//     cy.visit(baseUrl);
//     cy.wait('@featureToggles', { timeout: 20000 });
//     cy.wait('@caseDetails', { timeout: 20000 });

//     cy.contains(/we can't load the case progress right now/i).should(
//       'be.visible',
//     );
//     cy.get('va-segmented-progress-bar').should('not.exist');
//   });
// });
