import manifest from '../manifest.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import mockNickData from './fixtures/mocks/mockInitializeVet360Id.json';
import { cypressSetup } from './utils';

const APIs = {
  prefill: '/v0/in_progress_forms/WELCOME_VA_SETUP_REVIEW_INFORMATION',
};

describe('Welcome to My VA Review Contact Information form', () => {
  const setupAuthUser = () => {
    cy.intercept(APIs.prefill, { statusCode: 200, body: mockPrefill }).as(
      'mockSip',
    );
    //   cy.login(mockUser);
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser']);
  };
  const startApplication = () => {
    // cy.wait('@mockSip');
    // Ensure we've navigated to the contact information form
    cy.location('pathname').should('match', /\/contact-information$/);
  };

  context('when navigating the form', () => {
    beforeEach(() => {
      cypressSetup();
      setupAuthUser();
      startApplication();
      cy.intercept('POST', '/v0/profile/initialize_vet360_id', mockNickData);
    });

    it('should be completable', () => {
      cy.injectAxe();

      // Ensure that the contact information page is accessible
      cy.axeCheck();

      // Click the edit button
      cy.get('#edit-mobile-phone').click();

      // Ensure we've navigated to the right page
      cy.location('pathname').should('include', '/edit-mobile-phone');

      // Ensure that the edit mobile phone page is accessible
      // cy.axeCheck();

      // Type a new value
      // cy.get('[name="root_inputPhoneNumber"]').type(testData.mobilePhone);

      // Save the  mobile phone page
      // cy.get('[data-testid="save-edit-button"]').click();

      // cy.get('#edit-email').click();
      // cy.get('#edit-address').click();

      // Click the save button
      // cy.get('#2-continueButton').click();
    });
  });
});
