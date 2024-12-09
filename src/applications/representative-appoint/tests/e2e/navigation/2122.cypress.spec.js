import * as h from '../../../utilities/e2eHelpers';
import { ROUTES } from '../../../constants/routes';
import { makeMockUser } from '../../fixtures/data/user';
import mockRepResults from '../../fixtures/data/representative-results.json';

describe('Authenticated', () => {
  context('user is veteran', () => {
    beforeEach(() => {
      const user = makeMockUser();
      cy.login(user);
      cy.intercept(
        'GET',
        '/representation_management/v0/original_entities?query=**',
        mockRepResults,
      ).as('fetchRepresentatives');
    });

    it('navigates through the flow successfully', () => {
      cy.visit(h.ROOT);

      // INTRO
      h.verifyUrl(ROUTES.INTRO);
      cy.injectAxeThenAxeCheck();
      h.clickStartAuth();

      // CLAIMANT_TYPE
      h.verifyUrl(ROUTES.CLAIMANT_TYPE);
      cy.get('va-radio-option[value="Yes"] label').click();
      h.clickContinue();

      // REPRESENTATIVE_SELECT
      h.verifyUrl(ROUTES.REPRESENTATIVE_SELECT);

      cy.get('#inputField').type('Billy');

      cy.contains('Search').click();

      cy.contains('Billy Ryan').should('be.visible');

      cy.contains('button', 'Select this representative')
        .first()
        .click();

      // REPRESENTATIVE_CONTACT
      h.verifyUrl(ROUTES.REPRESENTATIVE_CONTACT);
      h.clickContinue();

      // REPRESENTATIVE_ORGANIZATION
      h.verifyUrl(ROUTES.REPRESENTATIVE_ORGANIZATION);
      cy.contains('label', 'American Legion').click();

      h.clickContinue();

      // VETERAN_PERSONAL_INFORMATION;
      h.verifyUrl(ROUTES.VETERAN_PERSONAL_INFORMATION);
      cy.get('input[name="root_veteranFullName_first"]').type('John');
      cy.get('input[name="root_veteranFullName_middle"]').type('Edmund');
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

      cy.get('input[name="root_Primary phone"]').type('5467364732');

      h.clickContinue();

      // VETERAN_IDENTIFICATION
      h.verifyUrl(ROUTES.VETERAN_IDENTIFICATION);

      cy.get('input[name="root_veteranSocialSecurityNumber"]').type(
        '658432765',
      );

      h.clickContinue();

      // AUTHORIZE_MEDICAL
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL);
      h.selectRadio('authorizationRadio', 1);

      h.clickContinue();

      // AUTHORIZE_MEDICAL_SELECT
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL_SELECT);
      h.selectCheckbox('authorizeMedicalSelectCheckbox', 0);
      h.selectCheckbox('authorizeMedicalSelectCheckbox', 1);

      h.clickContinue();

      // AUTHORIZE_ADDRESS
      h.verifyUrl(ROUTES.AUTHORIZE_ADDRESS);
      h.selectRadio('authorizeAddressRadio', 0);

      h.clickContinue();

      // REVIEW_AND_SUBMIT
      h.verifyUrl(ROUTES.REVIEW_AND_SUBMIT);
      h.clickBack();

      // AUTHORIZE_ADDRESS
      h.verifyUrl(ROUTES.AUTHORIZE_ADDRESS);
      h.clickBack();

      // AUTHORIZE_MEDICAL_SELECT
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL_SELECT);
      h.clickBack();

      // AUTHORIZE_MEDICAL
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL);
      h.clickBack();

      // VETERAN_IDENTIFICATION
      h.verifyUrl(ROUTES.VETERAN_IDENTIFICATION);
      h.clickBack();

      // VETERAN_CONTACT_PHONE_EMAIL
      h.verifyUrl(ROUTES.VETERAN_CONTACT_PHONE_EMAIL);
      h.clickBack();

      // VETERAN_CONTACT_MAILING
      h.verifyUrl(ROUTES.VETERAN_CONTACT_MAILING);
      h.clickBack();

      // VETERAN_PERSONAL_INFORMATION;
      h.verifyUrl(ROUTES.VETERAN_PERSONAL_INFORMATION);
      h.clickBack();

      // REPRESENTATIVE_ORGANIZATION
      h.verifyUrl(ROUTES.REPRESENTATIVE_ORGANIZATION);
      h.clickBack();

      // REPRESENTATIVE_CONTACT
      h.verifyUrl(ROUTES.REPRESENTATIVE_CONTACT);
      h.clickBack();

      // REPRESENTATIVE_SELECT
      h.verifyUrl(ROUTES.REPRESENTATIVE_SELECT);
      h.clickBack();

      // CLAIMANT_TYPE
      h.verifyUrl(ROUTES.CLAIMANT_TYPE);
      h.clickBack();

      // INTRO
      h.verifyUrl(ROUTES.INTRO);
    });
  });
});
