import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import mockDependents from '../fixtures/mock-dependents.json';
import mockUser from '../fixtures/mockUser.json';
import manifest from '~/applications/personalization/view-dependents/manifest.json';

const VIEW_DEPENDENTS_PATH = manifest.rootUrl;
const VIEW_DEPENDENTS_ENDPOINT = '/v0/dependents_applications/show';
const FORM_686_ENDPOINT = '/v0/dependents_applications';

const setup = () => {
  disableFTUXModals();
  cy.login(mockUser);
  cy.intercept('GET', VIEW_DEPENDENTS_ENDPOINT, mockDependents).as(
    'mockDependents',
  );
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'dependents_management',
          value: true,
        },
      ],
    },
  });
  cy.visit(VIEW_DEPENDENTS_PATH);
};

const testInlineValidation = async () => {
  const buttons = await cy.findAllByRole('button', {
    name: /Remove this dependent/,
  });
  expect(buttons).to.have.length(2);
  cy.injectAxeThenAxeCheck();
  buttons[0].click();
  cy.findByRole('button', {
    name: /Submit VA Form 686c to remove this dependent/,
  }).click();
  cy.findByText(/Please select an option/).should('exist');
  cy.findAllByRole('alert').should('have.length', 4);
  cy.injectAxeThenAxeCheck();
};

const testSubmissionError = async () => {
  const buttons = await cy.findAllByRole('button', {
    name: /Remove this dependent/,
  });
  expect(buttons).to.have.length(2);
  cy.injectAxeThenAxeCheck();
  buttons[0].click();
  cy.selectRadio('root_reasonMarriageEnded', 'DIVORCE');
  cy.fillDate('root_date', '2009-10-10');
  cy.get('select[name="root_location_state"]').select('AL');
  cy.fill('input[name="root_location_city"]', 'Chicago');
  cy.intercept('POST', FORM_686_ENDPOINT, {
    body: {
      errors: [
        {
          title: 'server error',
          code: '500',
          status: '500',
        },
      ],
    },
    statusCode: 500,
  }).as('failedSubmission');
  cy.findByRole('button', {
    name: /Submit VA Form 686c to remove this dependent/,
  }).click();
  cy.findByRole('heading', {
    name: /We’re sorry. Something went wrong on our end/,
  }).should('exist');
  cy.injectAxeThenAxeCheck();
};

describe.skip('View dependents formlett', () => {
  beforeEach(() => {
    setup();
  });
  it('should use inline form validations', () => {
    testInlineValidation();
  });
  it('should handle a failed form submission', () => {
    testSubmissionError();
  });
});
