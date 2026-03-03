const baseUrl =
  '/careers-employment/track-your-vre-benefits/vre-benefit-status';

const buildCaseDetails = ({ stateList = [], overrides = {} } = {}) => ({
  data: {
    id: '123',
    type: 'ch31_case_details',
    attributes: {
      resCaseId: 'A123',
      orientationAppointmentDetails: null,
      externalStatus: {
        isDiscontinued: false,
        discontinuedReason: null,
        isInterrupted: false,
        interruptedReason: null,
        stateList,
      },
      ...overrides,
    },
  },
});

const stepStateList = step => [
  { stepCode: 'APP', status: step === 1 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'ELIG', status: step === 2 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'ORIENTATION', status: step === 3 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'INTAKE', status: step === 4 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'ENTITLEMENT', status: step === 5 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'REHAB_PLAN', status: step === 6 ? 'ACTIVE' : 'COMPLETE' },
  { stepCode: 'BENEFITS', status: step === 7 ? 'ACTIVE' : 'COMPLETE' },
];

const stubFeatureToggles = value =>
  cy.intercept('GET', '**/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'vre_eligibility_status_phase_2_updates', value }],
    },
  });

const stubCaseDetails = body =>
  cy.intercept('GET', '**/vre/v0/ch31_case_details*', {
    statusCode: 200,
    body,
  });

describe('CH31 My Case Management Hub - Step 4 (Initial Evaluation Counselor Meeting)', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
    stubFeatureToggles(true).as('featureToggles');
  });

  it('renders the progress tracker at step 4 with scheduling instructions', () => {
    stubCaseDetails(
      buildCaseDetails({
        stateList: stepStateList(4),
        overrides: {
          orientationAppointmentDetails: null,
        },
      }),
    ).as('caseDetails');

    cy.visit(baseUrl);
    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
    cy.get('va-segmented-progress-bar')
      .should('have.attr', 'current', '4')
      .and('have.attr', 'total', '7');
    cy.contains(
      /check your email to schedule your meeting with your counselor/i,
    ).should('be.visible');
    cy.get('va-need-help').should('exist');
  });

  it('shows appointment scheduled message when appointment details are present', () => {
    stubCaseDetails(
      buildCaseDetails({
        stateList: stepStateList(4),
        overrides: {
          orientationAppointmentDetails: {
            appointmentDateTime: '2026-03-10T14:00:00Z',
            appointmentPlace: 'VA Regional Office',
          },
        },
      }),
    ).as('caseDetails');

    cy.visit(baseUrl);
    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
    cy.get('va-segmented-progress-bar')
      .should('have.attr', 'current', '4')
      .and('have.attr', 'total', '7');
    cy.contains(
      /your initial evaluation appointment has been scheduled/i,
    ).should('be.visible');
    cy.contains(
      /reschedule, use your appointment confirmation rescheduling link/i,
    ).should('be.visible');
    cy.get('va-need-help').should('exist');
  });

  it('shows discontinued alert and hides tracker at step 4', () => {
    stubCaseDetails(
      buildCaseDetails({
        stateList: [],
        overrides: {
          externalStatus: {
            isDiscontinued: true,
            discontinuedReason: 'No response from Veteran',
            isInterrupted: false,
            interruptedReason: null,
            stateList: [],
          },
        },
      }),
    ).as('caseDetails');

    cy.visit(baseUrl);
    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains(/your chapter 31 claim has been discontinued/i).should(
      'be.visible',
    );
    cy.contains(/no response from veteran/i).should('be.visible');
    cy.get('va-segmented-progress-bar').should('not.exist');
  });

  it('shows error alert if API fails on step 4', () => {
    cy.intercept('GET', '**/vre/v0/ch31_case_details*', {
      statusCode: 500,
      body: {
        errors: [{ status: '500', title: 'Server error' }],
      },
    }).as('caseDetails');

    cy.visit(baseUrl);
    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains(/we can't load the case progress right now/i).should(
      'be.visible',
    );
    cy.get('va-segmented-progress-bar').should('not.exist');
  });
});
