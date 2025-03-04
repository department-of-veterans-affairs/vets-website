import * as h from '../../../utilities/e2eHelpers';
import { ROUTES } from '../../../constants/routes';
import { setupForAuth, startAsAuthUser } from '../utils';

describe('Authenticated', () => {
  context('user is veteran', () => {
    beforeEach(() => {
      setupForAuth();
    });

    it('navigates through the flow successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      // INTRO
      h.verifyUrl(ROUTES.INTRO);
      cy.injectAxeThenAxeCheck();

      startAsAuthUser();
      //   h.clickStartAuth();

      // CLAIMANT_TYPE
      h.verifyUrl(ROUTES.CLAIMANT_TYPE);
      cy.injectAxeThenAxeCheck();
      cy.get('va-radio-option[value="Yes"] label').click();
      h.clickContinue();

      // REPRESENTATIVE_SELECT
      h.verifyUrl(ROUTES.REPRESENTATIVE_SELECT);
      cy.injectAxeThenAxeCheck();

      cy.get('#inputField').type('Billy');

      cy.contains('Search').click();

      cy.contains('Billy Ryan').should('be.visible');

      cy.contains('button', 'Select Billy Ryan')
        .first()
        .click();

      // REPRESENTATIVE_CONTACT
      h.verifyUrl(ROUTES.REPRESENTATIVE_CONTACT);
      cy.injectAxeThenAxeCheck();
      h.clickContinue();

      h.verifyUrl(ROUTES.REPRESENTATIVE_SUBMISSION_METHOD);
      cy.injectAxeThenAxeCheck();

      cy.get(`va-radio[name="repSubmissionMethod"]`)
        .should('exist')
        .find('va-radio-option')
        .eq(1)
        .click();

      h.clickContinue();

      // REPRESENTATIVE_ORGANIZATION
      h.verifyUrl(ROUTES.REPRESENTATIVE_ORGANIZATION);
      cy.injectAxeThenAxeCheck();
      cy.contains('label', 'American Legion').click();

      h.clickContinue();

      // VETERAN_PERSONAL_INFORMATION;
      h.verifyUrl(ROUTES.VETERAN_PERSONAL_INFORMATION);
      cy.injectAxeThenAxeCheck();
      cy.get('input[name="root_veteranFullName_first"]').type('John');
      cy.get('input[name="root_veteranFullName_middle"]').type('E');
      cy.get('input[name="root_veteranFullName_last"]').type('Doe');

      cy.get('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select('January');

      cy.get('input[name="root_veteranDateOfBirthDay"]').type('01');
      cy.get('input[name="root_veteranDateOfBirthYear"]').type('1990');

      h.clickContinue();

      // VETERAN_CONTACT_MAILING
      h.verifyUrl(ROUTES.VETERAN_CONTACT_MAILING);
      cy.injectAxeThenAxeCheck();

      cy.get('va-select[name="root_veteranHomeAddress_country"]')
        .shadow()
        .find('select')
        .select('United States');

      cy.get('input[name="root_veteranHomeAddress_street"]').type(
        '123 Anywhere St',
      );

      cy.get('input[name="root_veteranHomeAddress_city"]').type('Anytown');

      cy.get('input[name="root_veteranHomeAddress_postalCode"]').type('43545');

      cy.get('va-select[name="root_veteranHomeAddress_state"]')
        .shadow()
        .find('select')
        .select('Ohio');

      h.clickContinue();

      // VETERAN_CONTACT_PHONE_EMAIL
      h.verifyUrl(ROUTES.VETERAN_CONTACT_PHONE_EMAIL);
      cy.injectAxeThenAxeCheck();

      cy.get('input[name="root_primaryPhone"]').type('5467364732');

      h.clickContinue();

      // VETERAN_IDENTIFICATION
      h.verifyUrl(ROUTES.VETERAN_IDENTIFICATION);
      cy.injectAxeThenAxeCheck();

      h.clickContinue();

      // AUTHORIZE_MEDICAL
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizationRadio', 1);

      h.clickContinue();

      // AUTHORIZE_MEDICAL_SELECT
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL_SELECT);
      cy.injectAxeThenAxeCheck();
      h.selectCheckbox('authorizeMedicalSelectCheckbox', 0);
      h.selectCheckbox('authorizeMedicalSelectCheckbox', 1);

      h.clickContinue();

      // AUTHORIZE_ADDRESS
      h.verifyUrl(ROUTES.AUTHORIZE_ADDRESS);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizeAddressRadio', 0);

      h.clickContinue();

      // REVIEW_AND_SUBMIT
      h.verifyUrl(ROUTES.REVIEW_AND_SUBMIT);
      cy.injectAxeThenAxeCheck();
    });
  });
});
