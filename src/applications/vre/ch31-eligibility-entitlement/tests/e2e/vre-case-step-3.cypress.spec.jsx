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

describe('CH31 My Case Management Hub - Step 3 (Orientation)', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('GET', '**/data/cms/*.json', { statusCode: 200 });
    stubFeatureToggles(true).as('featureToggles');
    stubCaseDetails(buildCaseDetails({ stateList: stepStateList(3) })).as(
      'caseDetails',
    );
    cy.visit(baseUrl);
    cy.wait('@featureToggles', { timeout: 20000 });
    cy.wait('@caseDetails', { timeout: 20000 });
  });

  it('renders the progress tracker at step 3', () => {
    cy.contains('h1', /your vr&e benefit status/i).should('be.visible');
    cy.get('va-segmented-progress-bar').should('exist');
    cy.contains(/orientation/i).should('be.visible');
    cy.contains(
      /choose between watching the va video orientation online or completing orientation during the initial evaluation/i,
    ).should('be.visible');
  });

  it('shows radio options for orientation preference', () => {
    cy.get('va-radio').should('exist');
    cy.get('va-radio-option').should('have.length.at.least', 2);
    cy.get('va-radio-option')
      .eq(0)
      .contains(/watch the va orientation video online/i);
    cy.get('va-radio-option')
      .eq(1)
      .contains(
        /complete orientation during the initial evaluation counselor meeting/i,
      );
  });

  it('shows video attestation UI when "Watch the VA Orientation Video online" is selected', () => {
    cy.get('va-radio-option')
      .eq(0)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.contains(
      /please watch the full video and self-certify upon completion/i,
    ).should('be.visible');
    cy.get('va-link')
      .should('have.attr', 'href')
      .and('include', 'youtube');
    cy.get('va-checkbox').should('exist');
    cy.get('va-button').should('exist');
  });

  it('shows error if trying to submit video attestation without checking the box', () => {
    cy.get('va-radio-option')
      .eq(0)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-button')
      .find('button')
      .click({ force: true });
    cy.contains(
      /you must acknowledge and attest that you have watched the video/i,
    ).should('be.visible');
  });

  it('submits successfully when attestation is checked', () => {
    cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
      statusCode: 200,
      body: { data: { id: '1', type: 'ch31_case_milestone' } },
    }).as('submitMilestone');
    cy.get('va-radio-option')
      .eq(0)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-checkbox')
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('va-button')
      .find('button')
      .click({ force: true });
    cy.wait('@submitMilestone');
    cy.contains(/your preference has been submitted/i).should('not.exist');
  });

  it('shows error alert if API fails on submit', () => {
    cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
      statusCode: 500,
      body: {},
    }).as('submitMilestone');
    cy.get('va-radio-option')
      .eq(0)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-checkbox')
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('va-button')
      .find('button')
      .click({ force: true });
    cy.wait('@submitMilestone');
    cy.contains(
      /something went wrong on our end while submitting your preference/i,
    ).should('be.visible');
  });

  it('shows submit button for "Complete orientation during the Initial Evaluation Counselor Meeting"', () => {
    cy.get('va-radio-option')
      .eq(1)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-button').should('exist');
  });

  it('submits successfully when "Complete orientation during the Initial Evaluation Counselor Meeting" is selected', () => {
    cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
      statusCode: 200,
      body: { data: { id: '1', type: 'ch31_case_milestone' } },
    }).as('submitMilestone');
    cy.get('va-radio-option')
      .eq(1)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-button')
      .find('button')
      .click({ force: true });
    cy.wait('@submitMilestone');
    cy.contains(/your preference has been submitted/i).should('not.exist');
  });

  it('shows error alert if API fails for "Complete orientation during the Initial Evaluation Counselor Meeting"', () => {
    cy.intercept('POST', '**/vre/v0/ch31_case_milestones', {
      statusCode: 500,
      body: {},
    }).as('submitMilestone');
    cy.get('va-radio-option')
      .eq(1)
      .find('input[type="radio"]')
      .check({ force: true });
    cy.get('va-button')
      .find('button')
      .click({ force: true });
    cy.wait('@submitMilestone');
    cy.contains(
      /something went wrong on our end while submitting your preference/i,
    ).should('be.visible');
  });
});
