import Timeouts from 'platform/testing/e2e/timeouts';

// Read inside Shadow DOM for this spec
Cypress.config('includeShadowDom', true);

const baseUrl =
  '/careers-employment/your-vre-eligibility/my-case-management-hub';

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

const discontinuedCaseDetails = buildCaseDetails({
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
});

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

describe('CH31 My Case Management Hub', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
  });

  it('shows an unavailable message when the feature toggle is off', () => {
    stubFeatureToggles(false).as('featureToggles');
    stubCaseDetails(buildCaseDetails({ stateList: stepStateList(1) })).as(
      'caseDetails',
    );

    cy.visit(baseUrl);

    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains('h1', /my case management hub/i, {
      timeout: Timeouts.slow,
    }).should('be.visible');
    cy.contains(/page isn.?t available right now/i).should('be.visible');
  });

  const stepCases = [
    {
      step: 1,
      label: 'application received',
      copy: /received your application for vr&e benefits/i,
    },
    {
      step: 2,
      label: 'eligibility determination',
      copy: /currently being reviewed for basic eligibility/i,
    },
    {
      step: 5,
      label: 'entitlement determination',
      copy: /completing the entitlement determination review/i,
    },
    {
      step: 6,
      label: 'rehabilitation plan',
      copy: /establish and initiate your chapter 31 rehabilitation plan/i,
    },
    {
      step: 7,
      label: 'benefits initiated',
      copy: /rehabilitation plan or career track has been initiated/i,
    },
  ];

  stepCases.forEach(({ step, label, copy }) => {
    it(`renders the progress tracker for step ${step} (${label})`, () => {
      stubFeatureToggles(true).as('featureToggles');
      stubCaseDetails(buildCaseDetails({ stateList: stepStateList(step) })).as(
        'caseDetails',
      );

      cy.visit(baseUrl);

      cy.wait('@featureToggles', { timeout: 20000 });
      cy.wait('@caseDetails', { timeout: 20000 });

      cy.contains('h1', /my vr&e chapter 31 benefits tracker/i, {
        timeout: Timeouts.slow,
      }).should('be.visible');

      if (step === 1) {
        cy.injectAxeThenAxeCheck();
      }

      cy.get('va-segmented-progress-bar')
        .should('have.attr', 'current', String(step))
        .and('have.attr', 'total', '7');

      cy.contains(copy).should('be.visible');
      cy.get('va-need-help').should('exist');
    });
  });

  it('shows a discontinued alert and hides the tracker', () => {
    stubFeatureToggles(true).as('featureToggles');
    stubCaseDetails(discontinuedCaseDetails).as('caseDetails');

    cy.visit(baseUrl);

    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });

    cy.contains('h1', /my vr&e chapter 31 benefits tracker/i, {
      timeout: Timeouts.slow,
    }).should('be.visible');
    cy.contains(
      /processing your chapter 31 claim has been discontinued/i,
    ).should('be.visible');
    cy.contains(/no response from veteran/i).should('be.visible');
    cy.get('va-link-action')
      .should('have.attr', 'text', 'View my letter')
      .and('be.visible');
    cy.get('va-segmented-progress-bar').should('not.exist');
  });

  it('shows a load failure alert when case details fail', () => {
    stubFeatureToggles(true).as('featureToggles');
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
