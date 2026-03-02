import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import formConfig from '../config/form';

import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { mockItf } from './cypress.helpers';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
} from '../constants';

describe.skip('526EZ keyboard only navigation', () => {
  it('navigate through a maximal form', () => {
    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.removeItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    cy.login(mockUser);

    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

    // `mockItf` is not a fixture; it can't be loaded as a fixture
    // because fixtures don't evaluate JS.
    cy.intercept('GET', '/v0/intent_to_file', mockItf());

    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);

    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );

    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);

    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);

    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim',
      mockSubmit,
    );

    // Stub submission status for immediate transition to confirmation page.
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/submission_status/*',
      '',
    );

    cy.fixture(path.join(__dirname, 'fixtures/data/maximal-test.json')).then(
      data => {
        const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
          ({ 'view:selected': _, ...obj }) => obj,
        );

        cy.intercept('GET', `${MOCK_SIPS_API}*`, {
          formData: {
            veteran: {
              primaryPhone: '4445551212',
              emailAddress: 'test2@test1.net',
            },
            disabilities: sanitizedRatedDisabilities,
          },
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
      },
    );

    /*
  NON-BDD TESTING SUMMARY
    I. Veteran Details (See https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/disability/526ez/526-overall-flow.md#veteran-details)
      A. Veteran Information
      B. Contact Information
        1. Can update existing info
        2. Can start editing but then cancel
        3. Can indicate address on a military base outside of the US
        4. Can indicate a US address
        5. Can edit newly provided address
        6. Can edit contact information stored on profile page
      C. Alternative Names
        1. Can indicate that they are not at risk of becoming homeless
      D. Alternative Names
        1. Can indicate that they have no alternate names
        2. Can indicate they do have alternate names
        3. Can provide first alterate name
        4. Can provide a second alternate name
        5. Can begin providing a third alternate name but then cancel
        6. Can update the second alternate name
      E. Military History (if not in Reserve National Guard)
        1. Can provide non-RNG service branch
        2. Can provide first service period
        3. Can provide second service period
        4. Can remove the second service period
        5. Can edit the first service period
        6. Submission brings them to Separation Pay page, rather than the Reserve National Guard Info page
      F. Military History (if in Reserve National Guard)
        1. Can provide RNG service branch
      G. Reserve National Guard Info
        1. Can provide service period
      H. Federal Orders
      I. Separation Pay
        1. Can provide separation pay details if received
        2. Can indicate that they never received separation pay
      J. Retirement Pay
        1. Can provide retirement pay details, if they exist
        2. Can indicate that they never received retirement pay
      K. Training Pay
    II. Disabilities
      ...
      */

    let idRoot = '';
    const { chapters } = formConfig;
    const veteranDetailsPages = chapters.veteranDetails.pages;
    const disabilitiesPages = chapters.disabilities.pages;
    // Go to the introduction page and skip to just start the form
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();

    cy.tabToElement('.skip-wizard-link');
    cy.realPress('Enter');

    // Start the application
    cy.url().should(
      'include',
      '/disability/file-disability-claim-form-21-526ez/introduction',
    );
    cy.injectAxeThenAxeCheck();
    cy.tabToStartForm();
    // Notified that intent to file has been submitted
    cy.url().should('include', veteranDetailsPages.veteranInformation.path);
    cy.injectAxeThenAxeCheck();
    // Can continue on to the rest of the form
    cy.tabToElement('.usa-button-primary');
    cy.realPress('Enter');

    // I. Veteran Details > A. Veteran Information
    // ===========================================
    cy.url().should('include', veteranDetailsPages.veteranInformation.path);
    cy.injectAxeThenAxeCheck();
    cy.tabToElement('va-telephone');
    // Here, just testing that the user can navigate to the save, back, and
    // continue buttons with their keyboard. These buttons appear to be
    // a part of a shared component, I don't believe there is a need to run
    // these particular tests again.
    // cy.tabToElement('.schemaform-sip-save-link');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Details > B. Contact Information
    // ===========================================
    cy.url().should('include', veteranDetailsPages.contactInformation.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can indicate address on a military base outside of the US
    idRoot = '#root_mailingAddress_';
    // NOTE: Cypress quirk - unable to select checkbox by ID or by label text
    // (via tabToInputWithLabel), but selecting by input type works.
    cy.tabToElementAndPressSpace('[type="checkbox"]');
    cy.typeInIfDataExists(`${idRoot}addressLine1`, '123 foo st');
    cy.typeInIfDataExists(`${idRoot}addressLine2`, 'Apt 1');
    cy.typeInIfDataExists(`${idRoot}addressLine3`, 'Room 2');
    cy.tabToElement(`${idRoot}city`);
    cy.chooseSelectOptionByTyping('APO');
    cy.tabToElement(`${idRoot}state`);
    cy.chooseSelectOptionByTyping('Armed Forces Americas (AA)');
    cy.typeInIfDataExists(`${idRoot}zipCode`, '11111');

    // 4. Can indicate a US address
    cy.tabToElementAndPressSpace('[type="checkbox"]', false);
    cy.tabToElement(`${idRoot}country`);
    cy.chooseSelectOptionByTyping('USA');
    // (Street address already exists from before)
    cy.typeInIfDataExists(`${idRoot}city`, 'Foo');
    cy.tabToElement(`${idRoot}state`);
    cy.chooseSelectOptionByTyping('Alabama');
    cy.tabToElementAndPressSpace('.update-button');

    // 2. Can edit newly provided address
    // TODO: after saving mailing address, focus is brought to the Phone &
    // Email header, rather than the Mailing Address header. Might need to
    // fix that.
    cy.tabToElementAndPressSpace('[aria-label="Edit Mailing address"]');
    cy.tabToElementAndPressSpace('.cancel-button');

    // 3. Can edit contact information stored on profile page
    cy.tabToElement('[href="/profile/contact-information"]');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Details > C. Housing Situation
    // =========================================
    cy.url().should('include', veteranDetailsPages.homelessOrAtRisk.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can indicate that they are not at risk of becoming homeless
    cy.tabToElement('[type="radio"]');
    cy.findOption('no');
    cy.realPress('Space');
    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Details > D. Alternative Names
    // =========================================
    cy.url().should('include', veteranDetailsPages.alternateNames.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can indicate that they have no alternate names
    cy.tabToElement('[type="radio"]');
    cy.findOption('N');
    cy.tabToElement('#2-continueButton');

    // 2. Can indicate they do have alternate names
    cy.tabToElement('[type="radio"]', false);
    cy.findOption('Y');

    // 3. Can provide first alterate name
    idRoot = '#root_alternateNames_';
    cy.typeInIfDataExists(`${idRoot}0_first`, 'FIRSTNAME');
    cy.typeInIfDataExists(`${idRoot}0_middle`, 'MIDDLENAME');
    cy.typeInIfDataExists(`${idRoot}0_last`, 'LASTNAME');

    // 4. Can provide a second alternate name
    cy.tabToElementAndPressSpace('.va-growable-add-btn');
    cy.typeInFocused('FIRSTNAME');
    cy.typeInIfDataExists(`${idRoot}1_middle`, 'MIDDLENAME');
    cy.typeInIfDataExists(`${idRoot}1_last`, 'LASTNAME');

    // 5. Can begin providing a third alternate name but then cancel
    cy.tabToElementAndPressSpace('.va-growable-add-btn');
    cy.tabToElementAndPressSpace('[aria-label="Remove name"]');

    // 6. Can update the second alternate name
    cy.tabToElementAndPressSpace('.edit', false);
    cy.tabToElement('[aria-label="Update name"]');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Details > E. Military History (if not in Reserve National Guard)
    // ===========================================================================
    cy.url().should('include', veteranDetailsPages.militaryHistory.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can indicate non-RNG service branch
    idRoot = '#root_serviceInformation_servicePeriods_';
    cy.tabToElement(`${idRoot}0_serviceBranch`);
    // NOTE: can we test by arrowing down?
    cy.chooseSelectOptionByTyping('Marine Corps');

    // 2. Can provide first service period
    cy.tabToElement(`${idRoot}0_dateRange_fromMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}0_dateRange_fromDay`);
    cy.chooseSelectOptionByTyping('20');
    cy.typeInIfDataExists(`${idRoot}0_dateRange_fromYear`, '2014');
    cy.tabToElement(`${idRoot}0_dateRange_toMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}0_dateRange_toDay`);
    cy.chooseSelectOptionByTyping('20');
    cy.typeInIfDataExists(`${idRoot}0_dateRange_toYear`, '2018');
    cy.tabToElementAndPressSpace('[type="button"]');

    // 3. Can provide second service period
    cy.tabToElementAndPressSpace('.va-growable-add-btn');
    cy.tabToElement(`${idRoot}1_serviceBranch`);
    cy.chooseSelectOptionByTyping('Marine Corps Reserves');
    cy.tabToElement(`${idRoot}1_dateRange_fromMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}1_dateRange_fromDay`);
    cy.chooseSelectOptionByTyping('22');
    cy.typeInIfDataExists(`${idRoot}1_dateRange_fromYear`, '2018');
    cy.tabToElement(`${idRoot}1_dateRange_toMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}1_dateRange_toDay`);
    cy.chooseSelectOptionByTyping('22');
    cy.typeInIfDataExists(`${idRoot}1_dateRange_toYear`, '2022');
    cy.tabToElementAndPressSpace('[type="button"]');
    // (After saving, edit button is focused)

    // 4. Can remove the second service period
    cy.realPress('Space');
    cy.tabToElementAndPressSpace('.usa-button-secondary');

    // 5. Can edit the first service period
    cy.tabToElementAndPressSpace('.edit', false);
    cy.tabToElement(`${idRoot}0_serviceBranch`);
    cy.chooseSelectOptionByTyping('Navy');
    cy.tabToElementAndPressSpace('[type="button"]');

    // For some reason using `cy.tabToContinueFormSimulatedEnter` here doesn't work. It
    // instead will skip ahead to the following page.
    cy.tabToElementAndPressSpace('button[type="submit"]');

    // 6. Submission brings them to Separation Pay page, rather than the Reserve National Guard Info page
    cy.url().should('include', veteranDetailsPages.separationPay.path);
    cy.injectAxeThenAxeCheck();

    // For some reason using `cy.tabToGoBack` here doesn't work. It
    // instead will go forard a page, even though it finds the back button.
    cy.tabToElementAndPressSpace('#1-continueButton');

    // I. Veteran Details > F. Military History (if in Reserve National Guard)
    // =======================================================================
    cy.url().should('include', veteranDetailsPages.militaryHistory.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can provide RNG service branch
    cy.tabToElementAndPressSpace('.edit');
    cy.tabToElement(`${idRoot}0_serviceBranch`);
    cy.chooseSelectOptionByTyping('Army National Guard');
    cy.findByText('Save');
    cy.realPress('Enter');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Information > G. Reserve National Guard Info
    // =======================================================
    cy.url().should(
      'include',
      veteranDetailsPages.reservesNationalGuardService.path,
    );
    cy.injectAxeThenAxeCheck();

    const prefix = 'serviceInformation_reservesNationalGuardService_';
    idRoot = `#root_${prefix}`;

    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_fromMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_fromDay`);
    cy.chooseSelectOptionByTyping('22');
    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_fromYear`);
    cy.typeInFocused('2018');

    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_toMonth`);
    cy.chooseSelectOptionByTyping('April');
    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_toDay`);
    cy.chooseSelectOptionByTyping('22');
    cy.tabToElement(`${idRoot}obligationTermOfServiceDateRange_toYear`);
    cy.typeInFocused('2022');

    cy.typeInIfDataExists(`${idRoot}unitName`, 'CLR 45');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Information > H. Federal Orders
    // ==========================================
    cy.url().should('include', veteranDetailsPages.federalOrders.path);
    cy.injectAxeThenAxeCheck();

    // Here, we indicate that vet is NOT currently activated on federal orders
    // because we are simulating a non-BDD vet.
    cy.tabToElement('[type="radio"]');
    cy.findOption('N');
    cy.realPress('Space');

    // For some reason using `cy.tabToContinueFormSimulatedEnter` here doesn't work. It
    // instead will skip ahead to the following page.
    cy.tabToElementAndPressSpace('button[type="submit"]');

    // I. Veteran Information > I. Separation Pay
    // ==========================================
    cy.url().should('include', veteranDetailsPages.separationPay.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can provide separation pay details if received
    cy.tabToElement('[type="radio"]');
    cy.findOption('Y');
    cy.realPress('Space');
    cy.get(
      'va-text-input[name="root_view:separationPayDetails_separationPayDate"]',
    )
      .shadow()
      .find('input')
      .type('2019');
    cy.tabToElement(
      '[name="root_view:separationPayDetails_separationPayBranch"]',
    );
    cy.chooseSelectOptionByTyping('Army');

    // 2. Can indicate that they never received separation pay
    cy.tabToElement('[type="radio"]', false);
    cy.findOption('N');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Information > J. Retirement Pay
    // ==========================================
    cy.url().should('include', veteranDetailsPages.retirementPay.path);
    cy.injectAxeThenAxeCheck();

    // 1. Can provide retirement pay details, if they exist
    cy.tabToElement('[type="radio"]');
    cy.findOption('Y');
    cy.realPress('Space');
    cy.tabToElement('#root_militaryRetiredPayBranch');
    cy.chooseSelectOptionByTyping('Army');

    // 2. Can indicate that they never received retirement pay
    cy.tabToElement('[type="radio"]', false);
    cy.findOption('N');

    cy.tabToContinueFormSimulatedEnter();

    // I. Veteran Information > K. Training Pay
    // ========================================
    cy.url().should('include', veteranDetailsPages.trainingPay.path);
    cy.injectAxeThenAxeCheck();

    cy.tabToElement('[type="radio"]');
    cy.findOption('Y');
    cy.realPress('Space');

    cy.findOption('N');

    cy.tabToContinueFormSimulatedEnter();

    // II. Disabilities
    cy.url().should('include', disabilitiesPages.addDisabilities.path);
    cy.injectAxeThenAxeCheck();
  });
});
