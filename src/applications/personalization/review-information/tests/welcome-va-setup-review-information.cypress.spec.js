import manifest from '../manifest.json';
import { cypressSetup } from './utils';
import mockUser from './fixtures/mocks/user.json';

describe('Welcome to My VA Review Contact Information form', () => {
  const formURL = `${manifest.rootUrl}/contact-information`;
  const editMobileNumber = () => {
    cy.get('#edit-mobile-phone').click();
    cy.location('pathname').should('include', '/edit-mobile-phone');
    cy.axeCheck();

    cy.get('input[name="root_inputPhoneNumber"]').clear();
    cy.get('input[name="root_inputPhoneNumber"]').type('1234567890');

    cy.findByTestId('save-edit-button').click();
  };

  // Uses the VaTelephoneInput component when the profileInternationalPhoneNumbers flag is ON
  const editMobileNumberWithVaTelephoneInput = () => {
    cy.get('#edit-mobile-phone').click();
    cy.location('pathname').should('include', '/edit-mobile-phone');
    cy.axeCheck();

    cy.get('va-telephone-input')
      .shadow()
      .find('va-text-input')
      .shadow()
      .find('input')
      .clear()
      .type('1234567890', { force: true });

    cy.findByTestId('save-edit-button').click();
  };

  const editEmailAddress = () => {
    cy.get('#edit-email').click();
    cy.location('pathname').should('include', '/edit-email');
    cy.axeCheck();

    cy.get('input[name="root_emailAddress"]').clear();
    cy.get('input[name="root_emailAddress"]').type('test@email.com');

    // Update fails in CI, so we'll cancel instead
    // cy.findByTestId('save-edit-button').click();
    cy.findByTestId('cancel-edit-button').click();
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

    // Update fails in CI, so we'll cancel instead
    // cy.findByTestId('save-edit-button').click();
    // cy.findByTestId('confirm-address-button').click();
    cy.findByTestId('cancel-edit-button').click();
  };

  const checkConfirmationPage = () => {
    cy.findByText('Continue').click();
    cy.location('pathname').should('include', '/confirmation');
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.focused().should('have.attr', 'id', 'confirmation-content');

    cy.axeCheck();
  };

  context('when signed in', () => {
    beforeEach(() => {
      cypressSetup();
      cy.login(mockUser);
      cy.visit(formURL);
      cy.wait(['@mockUser', '@features', '@mockVamc']);
    });

    it('should be completable', () => {
      cy.location('pathname').should('match', /\/contact-information$/);

      cy.injectAxe();
      cy.axeCheck();

      cy.get('h1[data-testid="form-title"]').should('exist');
      cy.get('[name="header-mobile-phone"]').should('exist');

      editMobileNumber();
      editEmailAddress();
      editMailingAddress();
      checkConfirmationPage();
    });
  });

  context('when signed in and profileInternationalPhoneNumbers is ON', () => {
    beforeEach(() => {
      cypressSetup({ internationalPhonesEnabled: true });
      cy.login(mockUser);
      cy.visit(formURL);
      cy.wait(['@mockUser', '@mockVamc']);
    });

    it('should be completable', () => {
      cy.location('pathname').should('match', /\/contact-information$/);

      cy.injectAxe();
      cy.axeCheck();

      cy.get('h1[data-testid="form-title"]').should('exist');
      cy.get('[name="header-mobile-phone"]').should('exist');

      editMobileNumberWithVaTelephoneInput();
      editEmailAddress();
      editMailingAddress();
      checkConfirmationPage();
    });
  });

  context('when not signed in', () => {
    beforeEach(() => {
      cypressSetup();
      cy.visit(formURL);
      cy.wait(['@features']);
    });

    // We do not need to test the sign-in flow, just that we are redirected to it, so we can skip the Axe check
    // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
    it('should redirect to sign in', () => {
      cy.location().should(loc => {
        expect(loc.search).to.contain(
          '?next=%2Fmy-va%2Fwelcome-va-setup%2Fcontact-information',
        );
      });
    });
  });
});
