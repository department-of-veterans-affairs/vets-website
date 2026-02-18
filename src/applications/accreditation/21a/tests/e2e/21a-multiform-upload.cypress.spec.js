/* eslint-disable cypress/no-unnecessary-waiting */
// no-op change to repro test failure
import 'cypress-axe';
import { setFeatureToggles } from './intercepts/feature-toggles';
import inProgressFormsResponse from './fixtures/mocks/in-progress-forms-response.json';

const baseUrl = '/representative/accreditation/attorney-claims-agent-form-21a/';
const introUrl = `${baseUrl}introduction`;
const convictionUrl = `${baseUrl}conviction`;
const underChargesUrl = `${baseUrl}under-charges`;
const convictionSupportingDocument1 =
  'src/applications/accreditation/21a/tests/e2e/fixtures/conviction_supporting_document_1.pdf';

const uploadImgDetails = uploadPath => ({
  name: uploadPath,
  size: 2783621,
  password: false,
  additionalData: {},
});

const vamcUser = { data: { nodeQuery: { count: 0, entities: [] } } };

const setUpIntercepts = (
  featureToggles = {
    isAppEnabled: true,
    isInPilot: true,
    isForm21Enabled: true,
  },
) => {
  cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcUser).as('vamcUser');
  setFeatureToggles(featureToggles);
};

Cypress.Commands.add('seedUserWith21aSIP', (returnUrlRel = '/conviction') => {
  const nowSec = 4918241875; // Fixed timestamp: 2125-11-07 00:00:00 UTC
  cy.intercept('GET', '/accredited_representative_portal/v0/user', {
    statusCode: 200,
    headers: { 'cache-control': 'no-store' },
    body: {
      account: { accountUuid: '895e72d8-cadb-4929-93dd-a61a6b8c3f61' },
      profile: {
        firstName: 'HECTOR',
        lastName: 'J',
        verified: true,
        signIn: { serviceName: 'logingov' },
        loa: { current: 3, highest: 3 },
      },
      prefillsAvailable: [],
      inProgressForms: [
        {
          form: '21a',
          metadata: {
            version: 0,
            returnUrl: returnUrlRel,
            savedAt: nowSec * 1000,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            createdAt: nowSec - 3000,
            expiresAt: nowSec + 7 * 24 * 60 * 60,
            lastUpdated: nowSec,
            inProgressFormId: 2,
          },
          lastUpdated: nowSec,
        },
      ],
    },
  }).as('fetchUserWithSIP');
});

Cypress.Commands.add('stub21aFormDataExact', (returnUrlRel = '/conviction') => {
  const nowSec = 4918241875; // Fixed timestamp: 2125-11-07 00:00:00 UTC
  const nowMs = nowSec * 1000;

  cy.intercept(
    'GET',
    '**/accredited_representative_portal/v0/in_progress_forms/21a*',
    {
      statusCode: 200,
      body: {
        // Minimal formData is fine for the yes/no route
        formData: {},
        metadata: {
          version: 0,
          returnUrl: returnUrlRel,
          savedAt: nowMs,
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          createdAt: nowSec - 3000,
          expiresAt: nowSec + 7 * 24 * 60 * 60,
          lastUpdated: nowSec,
          inProgressFormId: 2,
        },
      },
    },
  ).as('getInProgressForm');
});

describe('21A — resume to Conviction (yes/no)', () => {
  beforeEach(() => {
    setUpIntercepts();
    cy.intercept(
      'PUT',
      '**/accredited_representative_portal/v0/in_progress_forms/21a*',
      inProgressFormsResponse,
    ).as('saveInProgressForm');

    cy.seedUserWith21aSIP('/conviction');
    cy.stub21aFormDataExact('/conviction');
  });

  it('allows the user to upload 2 forms of the same one', () => {
    cy.visit(introUrl);

    cy.contains('button', /^Continue your application$/).click({ force: true });
    cy.wait('@getInProgressForm');

    cy.location('pathname').should('eq', convictionUrl);

    cy.get('va-radio[label*="Have you ever been convicted"]').should('exist');
    cy.get('va-radio-option[value="Y"]').should('exist');
    cy.get('va-radio-option[value="N"]').should('exist');
    cy.get('input[name="root_conviction"][value="Y"]').click({ force: true });

    cy.findByRole('button', { name: /^Continue$/i }).click();

    cy.get('textarea[name="root_convictionDetailsExplanation"]').type(
      'Test conviction explanation — filled via Cypress',
      { force: true },
    );

    cy.get('input[name="root_convictionDetailsCertification_certified"]').click(
      {
        force: true,
      },
    );

    cy.fillVaFileInputMultiple(
      'root_convictionDetailsDocuments',
      uploadImgDetails(convictionSupportingDocument1),
    );

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('button', { name: /^Continue$/i }).click();
    cy.location('pathname').should('eq', underChargesUrl);
  });
});
