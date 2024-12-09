import manifest from '../manifest.json';
import mockUser from './fixtures/mocks/mockUser';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
// import minTestData from './fixtures/data/minimal-test.json';
// import { goToNextPage } from './utils';

// const { data: testData } = minTestData;
const APIs = {
  prefill: '/v0/in_progress_forms/WELCOME_VA_SETUP_REVIEW_INFORMATION',
};

describe('Welcome to My VA Review Contact Information form', () => {
  const setupAuthUser = () => {
    cy.intercept(APIs.prefill, { statusCode: 200, body: mockPrefill }).as(
      'mockSip',
    );
    cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser']);
  };
  const startApplication = () => {
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/my-va/welcome-va-setup/review-information/contact-information',
    );
  };

  context('when user has no disability rating - 0%', () => {
    beforeEach(() => {
      setupAuthUser();
      startApplication();
    });

    it('should not follow the registration only pathway', () => {
      cy.get('#edit-mobile-phone').click();
      cy.location('pathname').should('include', '/edit-mobile-phone');
      // cy.get('[name="root_inputPhoneNumber"]').type(testData.mobilePhone);
      cy.get('[data-testid="save-edit-button"]').click();

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
