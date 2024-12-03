// import { format, subYears } from 'date-fns';
import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import maxTestData from './fixtures/maximal-test.json';
import validVAFileNumberResponse from './fixtures/va-file-number.json';

export const fillAddressWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}_country"]`);
  cy.chooseSelectOptionUsingValue(value.country);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street"]`, value.street);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street2"]`, value.street2);
  cy.typeInIfDataExists(`[name="root_${fieldName}_street3"]`, value.street3);
  cy.typeInIfDataExists(`[name="root_${fieldName}_city"]`, value.city);
  cy.tabToElement(`[name="root_${fieldName}_state"]`);
  cy.chooseSelectOptionUsingValue(value.state);
  cy.typeInIfDataExists(
    `[name="root_${fieldName}_postalCode"]`,
    value.postalCode,
  );
};

export const selectRadioWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="root_${fieldName}"]`);
  cy.findOption(value);
  cy.realPress('Space');
};

describe('Form 10-10EZR Keyboard Only', () => {
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    cy.login();
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'vaDependentsV2',
            value: true,
          },
        ],
      },
    }).as('mockFeatures');
    cy.intercept('GET', '/v0/in_progress_forms/686C-674-V2', {
      statusCode: 200,
      body: maxTestData,
    }).as('mockSip');
    cy.intercept(
      'GET',
      '/v0/profile/valid_va_file_number',
      validVAFileNumberResponse,
    ).as('validVaFileNumber');
    cy.intercept('PUT', '/v0/in_progress_forms/686C-674-V2', {});
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      },
    }).as('mockSubmit');
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.wrap(maxTestData).as('testData');
    cy.get('@testData').then(data => {
      cy.visit(manifest.rootUrl);

      cy.injectAxeThenAxeCheck();
      cy.wait(['@mockFeatures', '@validVaFileNumber']);

      cy.get('a[href="#start"]').realPress('Space');

      cy.get('.vads-c-action-link--green').click();

      cy.tabToElementAndPressSpace('[data-key="add"]');
      cy.tabToElementAndPressSpace('[data-key="remove"]');
      cy.tabToElementAndPressSpace('#\\32 -continueButton');
      cy.tabToElementAndPressSpace('[data-key="addSpouse"]');
      cy.tabToElementAndPressSpace('[data-key="addChild"]');
      cy.tabToElementAndPressSpace('[data-key="report674"]');
      cy.tabToElementAndPressSpace('[data-key="addDisabledChild"]');
      cy.tabToElementAndPressSpace('#\\32 -continueButton');

      cy.tabToElementAndPressSpace('[data-key="reportDivorce"]');
      cy.tabToElementAndPressSpace('[data-key="reportDeath"]');
      cy.tabToElementAndPressSpace(
        '[data-key="reportStepchildNotInHousehold"]',
      );
      cy.tabToElementAndPressSpace('[data-key="reportMarriageOfChildUnder18"]');
      cy.tabToElementAndPressSpace(
        '[data-key="reportChild18OrOlderIsNotAttendingSchool"]',
      );
      cy.tabToElementAndPressSpace('#\\32 -continueButton');
      cy.tabToElementAndPressSpace('#\\32 -continueButton');

      // Mailing address
      const mailingAddress = data?.veteranContactInformation?.veteranAddress;
      fillAddressWithKeyboard(
        'veteranContactInformation_veteranAddress',
        mailingAddress,
      );
      cy.tabToContinueForm();

      const {
        emailAddress,
        phoneNumber,
        internationalPhoneNumber,
        // electronicCorrespondence,
      } = data?.veteranContactInformation;
      cy.typeInIfDataExists(
        `[name="root_veteranContactInformation_phoneNumber"]`,
        phoneNumber,
      );
      cy.typeInIfDataExists(
        `[name="root_veteranContactInformation_internationalPhoneNumber"]`,
        internationalPhoneNumber,
      );
      cy.typeInIfDataExists(
        `[name="root_veteranContactInformation_emailAddress"]`,
        emailAddress,
      );

      cy.get(
        `[name="root_veteranContactInformation_electronicCorrespondence"]`,
      ).click();

      cy.tabToContinueForm();
    });
  });
});
