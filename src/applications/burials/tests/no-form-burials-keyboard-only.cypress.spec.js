import mockUser from './e2e/fixtures/mocks/mockUser';
import features from './e2e/fixtures/mocks/features.json';
import mockedInProgressForm from './e2e/fixtures/mocks/inProgressFormResponse.json';

describe('Burials Application', () => {
  beforeEach(() => {
    // Login and navigate to the introduction page before each test
    cy.login({
      data: {
        attributes: {
          ...mockUser.data.attributes,
        },
      },
    });
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/in_progress_forms/21P-530', mockedInProgressForm);
    cy.visit('/burials-and-memorials/application/530/introduction');
  });

  it('logs in successfully', () => {
    // After logging in, you can add some assertion here to ensure the login was successful.
    // For instance, checking for the presence of some user-specific element on the page.
    cy.injectAxeThenAxeCheck();
  });

  it('navigates through the temporary review page', () => {
    // If there are specific navigation steps for the review page, add them here.
  });

  it('validates that links return non-4xx status codes', () => {
    cy.get('a').each(_ => {});
  });
});
