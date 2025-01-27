import * as h from '../../../utilities/e2eHelpers';
import { ROUTES } from '../../../constants/routes';
import attorney from '../../fixtures/data/attorney.json';

describe('Unauthenticated', () => {
  context('User is non-veteran', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        '/representation_management/v0/original_entities?query=**',
        attorney,
      ).as('fetchRepresentatives');
      cy.intercept('POST', '/representation_management/v0/pdf_generator2122a', {
        statusCode: 200,
      }).as('pdfGeneration');

      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'appoint_a_representative_enable_frontend', value: true },
            {
              name: 'appoint_a_representative_enable_v2_features',
              value: false,
            },
          ],
        },
      });
    });

    it('navigates through the flow successfully', () => {
      cy.visit(h.ROOT);
      cy.injectAxeThenAxeCheck();

      // INTRO
      h.verifyUrl(ROUTES.INTRO);

      cy.injectAxeThenAxeCheck();
      h.clickStartUnauth();

      // CLAIMANT_TYPE
      h.verifyUrl(ROUTES.CLAIMANT_TYPE);
      cy.injectAxeThenAxeCheck();
      cy.get('va-radio-option[value="No"] label').click();
      h.clickContinue();

      // REPRESENTATIVE_SELECT
      h.verifyUrl(ROUTES.REPRESENTATIVE_SELECT);
      cy.injectAxeThenAxeCheck();

      cy.get('#inputField').type('John');

      cy.contains('Search').click();

      cy.contains('John Adams').should('be.visible');

      cy.contains('button', 'Select John Adams')
        .first()
        .click();

      // REPRESENTATIVE_CONTACT
      h.verifyUrl(ROUTES.REPRESENTATIVE_CONTACT);
      cy.injectAxeThenAxeCheck();
      h.clickContinue();

      // CLAIMANT_RELATIONSHIP
      h.verifyUrl(ROUTES.CLAIMANT_RELATIONSHIP);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('claimantRelationship', 0);
      h.clickContinue();

      // CLAIMANT_PERSONAL_INFORMATION;
      h.verifyUrl(ROUTES.CLAIMANT_PERSONAL_INFORMATION);
      cy.injectAxeThenAxeCheck();

      cy.get('input[name="root_applicantName_first"]').type('Adam');
      cy.get('input[name="root_applicantName_middle"]').type('J');
      cy.get('input[name="root_applicantName_last"]').type('Friedman');

      cy.get('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .select('April');
      cy.get('input[name="root_applicantDOBDay"]').type('01');
      cy.get('input[name="root_applicantDOBYear"]').type('1970');

      h.clickContinue();

      // CLAIMANT_CONTACT_MAILING
      h.verifyUrl(ROUTES.CLAIMANT_CONTACT_MAILING);
      cy.injectAxeThenAxeCheck();

      cy.get('va-select[name="root_homeAddress_country"]')
        .shadow()
        .find('select')
        .select('United States');

      cy.get('input[name="root_homeAddress_street"]').type('456 Broad Street');

      cy.get('input[name="root_homeAddress_city"]').type('Anywhere');

      cy.get('va-select[name="root_homeAddress_state"]')
        .shadow()
        .find('select')
        .select('MA');

      cy.get('input[name="root_homeAddress_postalCode"]').type('54673');

      h.clickContinue();

      // CLAIMANT_CONTACT_PHONE_EMAIL
      h.verifyUrl(ROUTES.CLAIMANT_CONTACT_PHONE_EMAIL);
      cy.injectAxeThenAxeCheck();

      cy.get('input[name="root_applicantPhone"]').type('5436578475');

      h.clickContinue();

      // VETERAN_PERSONAL_INFORMATION;
      h.verifyUrl(ROUTES.VETERAN_PERSONAL_INFORMATION);
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
      cy.get('input[name="root_veteranSocialSecurityNumber"]').type(
        '658432765',
      );

      h.clickContinue();

      // VETERAN_SERVICE_INFORMATION
      h.verifyUrl(ROUTES.VETERAN_SERVICE_INFORMATION);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('Branch of Service', 0);

      h.clickContinue();

      // AUTHORIZE_MEDICAL
      h.verifyUrl(ROUTES.AUTHORIZE_MEDICAL);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizationRadio', 0);

      h.clickContinue();

      // AUTHORIZE_ADDRESS
      h.verifyUrl(ROUTES.AUTHORIZE_ADDRESS);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizeAddressRadio', 0);

      h.clickContinue();

      // AUTHORIZE_INSIDE_VA
      h.verifyUrl(ROUTES.AUTHORIZE_INSIDE_VA);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizeInsideVARadio', 0);

      h.clickContinue();

      // AUTHORIZE_OUTSIDE_VA
      h.verifyUrl(ROUTES.AUTHORIZE_OUTSIDE_VA);
      cy.injectAxeThenAxeCheck();
      h.selectRadio('authorizeOutsideVARadio', 0);

      h.clickContinue();
      // AUTHORIZE_OUTSIDE_VA_NAMES
      h.verifyUrl(ROUTES.AUTHORIZE_OUTSIDE_VA_NAMES);
      cy.injectAxeThenAxeCheck();
      cy.get('input[name="root_authorizeNamesTextArea"]').type(
        'Bob Test, Tom Middleton',
      );

      h.clickContinue();

      // REVIEW_AND_SUBMIT
      h.verifyUrl(ROUTES.REVIEW_AND_SUBMIT);
      cy.injectAxeThenAxeCheck();

      cy.get(`va-checkbox[name="I agree to the terms and conditions"]`).click();
      cy.get(
        `va-checkbox[name="I accept that this form will replace all my other VA Forms 21-22 and 21-22a"]`,
      ).click();
      cy.get(`va-privacy-agreement`)
        .shadow()
        .find('input')
        .check({ force: true });

      h.clickContinue();

      // CONFIRMATION
      h.verifyUrl(ROUTES.CONFIRMATION);
      cy.injectAxeThenAxeCheck();

      cy.get('va-checkbox[name="signedForm"]').click();

      cy.get('va-button[continue]')
        .shadow() // Access the shadow DOM of the va-button
        .find('button.usa-button') // Locate the button inside the shadow root
        .click(); // Click the button

      // NEXT_STEPS
      cy.injectAxeThenAxeCheck();
      h.verifyUrl(ROUTES.NEXT_STEPS);
    });
  });
});
