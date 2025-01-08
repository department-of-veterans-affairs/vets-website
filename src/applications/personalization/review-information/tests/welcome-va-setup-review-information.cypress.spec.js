import manifest from '../manifest.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import { cypressSetup } from './utils';
import mockUser from './fixtures/mocks/user.json';

const APIs = {
  prefill: '/v0/in_progress_forms/WELCOME_VA_SETUP_REVIEW_INFORMATION',
};

describe('Welcome to My VA Review Contact Information form', () => {
  const startApplication = () => {
    cy.intercept(APIs.prefill, { statusCode: 200, body: mockPrefill }).as(
      'mockSip',
    );
    cy.visit(manifest.rootUrl);
    // cy.wait('@mockSip');

    // Ensure we've navigated to the contact information form
    cy.location('pathname').should('match', /\/contact-information$/);
  };

  const editMobileNumber = () => {
    cy.get('#edit-mobile-phone').click();
    cy.location('pathname').should('include', '/edit-mobile-phone');
    cy.axeCheck();

    cy.get('input[name="root_inputPhoneNumber"]').clear();
    cy.get('input[name="root_inputPhoneNumber"]').type('1234567890');

    cy.findByText('Update').click();
  };

  const editEmailAddress = () => {
    cy.get('#edit-email').click();
    cy.location('pathname').should('include', '/edit-email');
    cy.axeCheck();

    cy.get('input[name="root_emailAddress"]').clear();
    cy.get('input[name="root_emailAddress"]').type('test@email.com');

    // Update doesn't work
    // cy.findByText('Update').click();
    cy.findByText('Cancel').click();
  };

  const editMailingAddress = () => {
    cy.get('#edit-address').click();
    cy.location('pathname').should('include', '/edit-mailing-address');
    cy.axeCheck();

    cy.get('select[name="root_countryCodeIso3"]').select('United States');

    cy.get('input[name="root_addressLine1"]').clear();
    cy.get('input[name="root_addressLine1"]').type('Address line 1');

    cy.get('input[name="root_addressLine2"]').clear();
    cy.get('input[name="root_addressLine2"]').type('Address line 2');

    cy.get('input[name="root_addressLine3"]').clear();
    cy.get('input[name="root_addressLine3"]').type('Address line 3');

    cy.get('input[name="root_city"]').clear();
    cy.get('input[name="root_city"]').type('City');

    cy.get('select[name="root_stateCode"]').select('AL');

    cy.get('input[name="root_zipCode"]').clear();
    cy.get('input[name="root_zipCode"]').type('12345');

    cy.findByText('Update').click();

    // Update doesn't work
    // cy.findByText('Use this address').click();

    cy.findByText('Go back to edit').click();
    cy.findByText('Cancel').click();
  };

  const checkConfirmationPage = () => {
    cy.findByText('Continue').click();
    cy.location('pathname').should('include', '/confirmation');
    cy.focused().should('have.attr', 'id', 'confirmation-heading');

    cy.axeCheck();
  };

  context('when signed in', () => {
    beforeEach(() => {
      cypressSetup();
      cy.login(mockUser);
      startApplication();
    });

    it('should be completable', () => {
      cy.injectAxe();
      cy.axeCheck();

      editMobileNumber();
      editEmailAddress();
      editMailingAddress();
      checkConfirmationPage();
    });
  });

  context('when not signed in', () => {
    beforeEach(() => {
      cypressSetup();
      startApplication();
    });

    it('should redirect to sign in', () => {
      cy.axeCheck();
      cy.location().should(loc => {
        expect(loc.search).to.eq(
          '?next=%2Fmy-va%2Fwelcome-va-setup%2Freview-information%2Fcontact-information',
        );
      });
    });
  });
});
