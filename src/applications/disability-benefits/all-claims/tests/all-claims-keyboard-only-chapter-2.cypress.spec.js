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

import { mockItf } from './all-claims.cypress.helpers';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
} from '../constants';

describe('526EZ keyboard only navigation', () => {
  before(() => {
    cy.fixture(path.join(__dirname, 'fixtures/data/maximal-test.json')).as(
      'testData',
    );

    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.removeItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    cy.login(mockUser);

    cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

    // `mockItf` is not a fixture; it can't be loaded as a fixture
    // because fixtures don't evaluate JS.
    cy.intercept('GET', '/v0/intent_to_file', mockItf);

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

    cy.get('@testData').then(data => {
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
    });
  });

  /*
  NON-BDD TESTING SUMMARY
    I. Veteran Details
      See all-claims-keyboard-only-chapter-1.cypress.spec.js for maximal test.
      Here, we are just doing the bare minimum to get up to Chapter II.
    II. Disabilities (See https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/disability/526ez/526-overall-flow.md#disabilities)
      A. Add Disabilities (non-PTSD)
      B. Follow-Up Questions (Description)
      C. Follow-Up Questions (Condition #1)
      D. Follow-Up Questions (Condition #2)
      E. Prisoner of War
      F. Additional Disability Benefits, Learn More (No)
      G. Summary of Disabilities
      H. Add Disabilities (PTSD)
      I. Follow-Up Questions (Description)
      J. PTSD Intro
      ... TODO
  */
  it('navigate through a maximal form', () => {
    cy.get('@testData').then(() => {
      let idRoot = '';
      const { chapters } = formConfig;
      const veteranDetailsPages = chapters.veteranDetails.pages;
      const disabilitiesPages = chapters.disabilities.pages;
      const supportEvidencePages = chapters.supportingEvidence.pages;

      // Go to the introduction page and skip to just start the form
      cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
      cy.tabToElement('.skip-wizard-link');
      cy.realPress('Enter');
      // Start the application
      cy.url().should(
        'include',
        '/disability/file-disability-claim-form-21-526ez/introduction',
      );
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
      cy.tabToContinueForm();

      // I. Veteran Details > B. Contact Information
      // ===========================================
      cy.url().should('include', veteranDetailsPages.contactInformation.path);
      idRoot = '#root_mailingAddress_';
      cy.tabToElementAndPressSpace('[type="checkbox"]');
      cy.typeInIfDataExists(`${idRoot}addressLine1`, '123 foo st');
      cy.typeInIfDataExists(`${idRoot}addressLine2`, 'Apt 1');
      cy.typeInIfDataExists(`${idRoot}addressLine3`, 'Room 2');
      cy.tabToElement(`${idRoot}city`);
      cy.chooseSelectOptionByTyping('APO');
      cy.tabToElement(`${idRoot}state`);
      cy.chooseSelectOptionByTyping('Armed Forces Americas (AA)');
      cy.typeInIfDataExists(`${idRoot}zipCode`, '11111');
      cy.tabToContinueForm();

      // I. Veteran Details > C. Alternative Names
      // =========================================
      cy.url().should('include', veteranDetailsPages.alternateNames.path);
      cy.tabToElement('[type="radio"]');
      cy.findOption('N');
      cy.tabToContinueForm();

      // I. Veteran Details > D. Military History (if not in Reserve National Guard)
      // ===========================================================================
      cy.url().should('include', veteranDetailsPages.militaryHistory.path);
      idRoot = '#root_serviceInformation_servicePeriods_';
      cy.tabToElement(`${idRoot}0_serviceBranch`);
      cy.chooseSelectOptionByTyping('Marine Corps');
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
      cy.tabToContinueForm();

      // I. Veteran Information > H. Separation Pay
      // ==========================================
      cy.url().should('include', veteranDetailsPages.separationPay.path);
      cy.tabToElement('[type="radio"]');
      cy.findOption('N');
      cy.tabToContinueForm();

      // I. Veteran Information > I. Retirement Pay
      // ==========================================
      cy.url().should('include', veteranDetailsPages.retirementPay.path);
      cy.tabToElement('[type="radio"]');
      cy.findOption('N');
      cy.tabToContinueForm();

      // I. Veteran Information > J. Training Pay
      // ========================================
      cy.url().should('include', veteranDetailsPages.trainingPay.path);
      cy.tabToElement('[type="radio"]');
      cy.findOption('Y');
      cy.realPress('Space');
      cy.findOption('N');
      cy.tabToContinueForm();

      // II. Disabilities > A. Add Disabilities (non-PTSD)
      // =================================================
      cy.url().should('include', disabilitiesPages.addDisabilities.path);
      cy.injectAxeThenAxeCheck();

      // 1. Can add first condition
      cy.typeInIfDataExists('#root_newDisabilities_0_condition', 'back injury');
      cy.realPress('ArrowDown');
      cy.realPress('Enter');
      cy.tabToElementAndPressSpace('[type="button"]');

      // 2. Can edit first condition
      cy.realPress('Space');
      cy.typeInIfDataExists('#root_newDisabilities_0_condition', 'back sprain');
      cy.realPress('ArrowDown');
      cy.realPress('Enter');
      cy.tabToElementAndPressSpace('[type="button"]');

      // 3. Can add second condition
      cy.tabToElementAndPressSpace('.va-growable-add-btn');
      cy.typeInIfDataExists('#root_newDisabilities_1_condition', 'neck sprain');
      cy.realPress('ArrowDown');
      cy.realPress('Enter');
      cy.tabToElementAndPressSpace('[type="button"]');

      // 4. Can add and remove third condition
      cy.tabToElementAndPressSpace('.va-growable-add-btn');
      cy.tabToElementAndPressSpace(
        '[aria-label="Remove incomplete Condition"]',
      );
      cy.tabToContinueForm();

      // II. Disabilities > B. Follow-Up Questions (Description)
      // =========================================
      cy.url().should('include', disabilitiesPages.followUpDesc.path);
      cy.injectAxeThenAxeCheck();
      cy.tabToContinueForm();

      // II. Disabilities > C. Follow-Up Questions (Condition #1)
      // ========================================================
      cy.url().should(
        'include',
        disabilitiesPages.newDisabilityFollowUp.path.replace(':index', 0),
      );
      cy.injectAxeThenAxeCheck();

      // 1. Can indicate that injury was caused by an injury or exposure during military service
      cy.tabToElement('[type="radio"]');
      cy.findOption('NEW');
      cy.realPress('Space');
      cy.typeInIfDataExists('#root_primaryDescription', 'asdf');

      // 2. Can indicate that injury was caused by existing disability
      cy.tabToElement('[type="radio"]', false);
      cy.findOption('SECONDARY');
      // NOTE: for reasons I don't understand, we cannot select this <select> by Id. This happens elsewhere, but we have been able to select other <select>'s by Id.
      cy.tabToElement(
        '[name="root_view:secondaryFollowUp_causedByDisability"]',
      );
      cy.chooseSelectOptionByTyping('Neck Sprain');
      cy.typeInIfDataExists('textarea', 'asdf');

      // 3. Can indicate that injury worsened during military service
      cy.tabToElement('[type="radio"]', false);
      cy.findOption('WORSENED');
      cy.typeInIfDataExists(
        '[name="root_view:worsenedFollowUp_worsenedDescription"]',
        'asdf',
      );
      cy.typeInIfDataExists('textarea', 'asdf');

      // 4. Can indicate that injury was caused by VA care
      cy.tabToElement('[type="radio"]', false);
      cy.findOption('VA');
      cy.typeInIfDataExists('textarea', 'asdf');
      cy.typeInIfDataExists(
        '[name="root_view:vaFollowUp_vaMistreatmentLocation"]',
        'asdf',
      );
      cy.typeInIfDataExists(
        '[name="root_view:vaFollowUp_vaMistreatmentDate"]',
        'asdf',
      );
      cy.tabToContinueForm();

      // II. Disabilities > D. Follow-Up Questions (Condition #2)
      // ========================================================
      cy.url().should(
        'include',
        disabilitiesPages.newDisabilityFollowUp.path.replace(':index', 1),
      );
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[type="radio"]');
      cy.findOption('NEW');
      cy.realPress('Space');
      cy.typeInIfDataExists('#root_primaryDescription', 'asdf');
      cy.tabToContinueForm();

      // II. Disabilities > E. Prisoner of War
      // =====================================
      cy.url().should('include', disabilitiesPages.prisonerOfWar.path);
      cy.injectAxeThenAxeCheck();

      // 1. Can indicate that they have been a POW
      cy.tabToElement('[type="radio"]');
      cy.findOption('Y');
      cy.realPress('Space');

      // 2. Can indicate period of confinement
      idRoot = 'root_view:isPow_confinements_';
      cy.tabToElement(`[name="${idRoot}0_fromMonth"]`);
      cy.chooseSelectOptionByTyping('April');
      cy.tabToElement(`[name="${idRoot}0_fromDay"]`);
      cy.chooseSelectOptionByTyping('21');
      cy.typeInIfDataExists(`[name="${idRoot}0_fromYear"]`, '2014');
      cy.tabToElement(`[name="${idRoot}0_toMonth"]`);
      cy.chooseSelectOptionByTyping('May');
      cy.tabToElement(`[name="${idRoot}0_toDay"]`);
      cy.chooseSelectOptionByTyping('1');
      cy.typeInIfDataExists(`[name="${idRoot}0_toYear"]`, '2014');

      // 3. Can indicate a second period of confinement
      cy.tabToElementAndPressSpace('.va-growable-add-btn');
      // Already focused on From Month for new period
      cy.chooseSelectOptionByTyping('May');
      cy.tabToElement(`[name="${idRoot}1_fromDay"]`);
      cy.chooseSelectOptionByTyping('4');
      cy.typeInIfDataExists(`[name="${idRoot}1_fromYear"]`, '2014');
      cy.tabToElement(`[name="${idRoot}1_toMonth"]`);
      cy.chooseSelectOptionByTyping('June');
      cy.tabToElement(`[name="${idRoot}1_toDay"]`);
      cy.chooseSelectOptionByTyping('1');
      cy.typeInIfDataExists(`[name="${idRoot}1_toYear"]`, '2014');

      // 4. Can indicate a third period of confinement, but then remove it
      cy.tabToElementAndPressSpace('.va-growable-add-btn');
      // "Remove" button
      cy.tabToElementAndPressSpace('[type="button"]');

      // 5. Can edit the first period of confinement
      cy.tabToElementAndPressSpace('.edit', false);
      // "Update" button
      cy.tabToElementAndPressSpace('[type="button"]');

      // 6. Can indicate conditions caused or affected by POW experience
      cy.tabToElementAndPressSpace(
        '[name="root_view:isPow_powDisabilities_backsprain"]',
      );

      cy.tabToContinueForm();

      // II. Disabilities > F. Additional Disability Benefits, Learn More (No)
      // =====================================================================
      cy.url().should(
        'include',
        disabilitiesPages.ancillaryFormsWizardIntro.path,
      );
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[type="radio"]');
      cy.findOption('N');
      cy.realPress('Space');
      cy.tabToContinueForm();

      // II. Disabilities > G. Summary of Disabilities
      // =============================================
      cy.url().should('include', disabilitiesPages.summaryOfDisabilities.path);
      cy.injectAxeThenAxeCheck();

      cy.tabToContinueForm();

      // II. Disabilities > H. Add Disabilities (PTSD)
      // =======================================================
      // First, need to go all the way back to the "Add Disabilities" page.
      cy.url().should('include', supportEvidencePages.orientation.path);
      cy.tabToGoBack();
      cy.url().should('include', disabilitiesPages.summaryOfDisabilities.path);
      cy.tabToGoBack();
      cy.url().should(
        'include',
        disabilitiesPages.ancillaryFormsWizardIntro.path,
      );
      cy.tabToGoBack();
      cy.url().should('include', disabilitiesPages.prisonerOfWar.path);
      cy.tabToGoBack();
      cy.url().should(
        'include',
        disabilitiesPages.newDisabilityFollowUp.path.replace(':index', 1),
      );
      cy.tabToGoBack();
      cy.url().should(
        'include',
        disabilitiesPages.newDisabilityFollowUp.path.replace(':index', 0),
      );
      cy.tabToGoBack();
      cy.url().should('include', disabilitiesPages.followUpDesc.path);
      cy.tabToGoBack();
      cy.url().should('include', disabilitiesPages.addDisabilities.path);

      // Second, need to remove all existing disabilities so we can start fresh
      cy.tabToElementAndPressSpace('.edit');
      cy.tabToElementAndPressSpace('.usa-button-secondary.float-right');

      // 1. Can add PTSD disability
      cy.tabToElementAndPressSpace('.edit', false);
      cy.typeInIfDataExists('#root_newDisabilities_0_condition', 'PTSD');
      cy.realPress('ArrowDown');
      cy.realPress('Enter');
      cy.tabToElementAndPressSpace('[type="button"]');

      cy.tabToContinueForm();

      // II. Disabilities > I. Follow-Up Questions (Description)
      // =======================================================
      cy.url().should('include', disabilitiesPages.followUpDesc.path);

      cy.tabToContinueForm();

      // II. Disabilities > J. PTSD Intro
      // ================================
      cy.url().should('include', disabilitiesPages.newPTSDFollowUp.path);
      cy.injectAxeThenAxeCheck();

      // 1. Can call crisis line, visit crisis line website, send a text for help
      cy.tabToElement('[contact="8002738255"]');
      cy.tabToElement(
        '[href="https://www.veteranscrisisline.net/get-help-now/chat/"]',
      );
      cy.tabToElement('[href="sms:838255"]');

      // 2. Can call TTY
      cy.tabToElement('[class="hydrated"]');

      cy.tabToContinueForm();

      // II. Disabilities > K. PTSD Type
      // ===============================
      cy.url().should('include', disabilitiesPages.choosePtsdType.path);
      cy.injectAxeThenAxeCheck();

      // // TODO: tests below failing. Should try name, as opposed to ID.

      // // 1. Select Combat
      cy.setCheckboxFromData(
        '[name="root_view:selectablePtsdTypes_view:combatPtsdType"]',
        true,
      );
      cy.tabToContinueForm();
      // PTSD combat Question
      cy.url().should('include', disabilitiesPages.ptsdBypassCombat.path);
      cy.tabToElement('[type="radio"]');
      cy.findOption('Y');
      cy.tabToContinueForm();
      cy.tabToGoBack();
      // Uncheck Combat and check MST
      cy.setCheckboxFromData(
        '[name="root_view:selectablePtsdTypes_view:combatPtsdType"]',
        false,
      );
      cy.setCheckboxFromData(
        '[name="root_view:selectablePtsdTypes_view:mstPtsdType"]',
        true,
      );
      cy.tabToContinueForm();
      // PTSD: Personal assault & sexual trauma Question & answer questions path
      cy.url().should(
        'include',
        disabilitiesPages.ptsdWalkthroughChoice781a.path,
      );
      cy.tabToElement('[type="radio"]');
      cy.findOption('upload');
      // TO DO: mock upload a file for option: "I’ve already filled out VA Form 21-0781a and want to upload it."
      cy.tabToContinueForm();
      cy.tabToGoBack();
      // Go back and answer questions instead of uploading a file
      cy.tabToElement('[type="radio"]');
      cy.findOption('answerQuestions');
      cy.realPress('Space');
      cy.tabToContinueForm();
      // Enter incident date
      cy.url().should(
        'include',
        '/disabilities/ptsd-secondary-incident-date-0',
      );
      idRoot = '#root_secondaryIncident';
      cy.tabToElement(`${idRoot}0_incidentDateMonth`);
      cy.chooseSelectOptionByTyping('April');
      cy.tabToElement(`${idRoot}0_incidentDateDay`);
      cy.chooseSelectOptionByTyping('22');
      cy.typeInIfDataExists(`${idRoot}0_incidentDateYear`, '2020');
      cy.tabToContinueForm();

      // Enter duty station assigned to at the time of incident
      cy.url().should(
        'include',
        '/disabilities/ptsd-secondary-incident-unit-assignment-0',
      );

      // cy.setCheckboxFromData(
      //   '[name="root_view:selectablePtsdTypes_view:assaultPtsdType"]',
      //   false,
      // );
      // cy.setCheckboxFromData(
      //   '[name="root_view:selectablePtsdTypes_view:nonCombatPtsdType"]',
      //   true,
      // );
      // cy.tabToContinueForm();
      // cy.url().should('include', disabilitiesPages.ptsdBypassNonCombat.path);
      // cy.tabToGoBack();

      // 4. Goes to "Fear of Hostile Activity" page specific to combat PTSD, if combat PTSD
      // cy.setCheckboxFromData(
      //   '[name="root_view:selectablePtsdTypes_view:nonCombatPtsdType"]',
      //   false,
      // );
      // cy.setCheckboxFromData(
      //   '[name="root_view:selectablePtsdTypes_view:combatPtsdType"]',
      //   true,
      // );
      // cy.tabToContinueForm();
      // cy.url().should('include', disabilitiesPages.ptsdBypassCombat.path);

      // II. Disabilities > Fear of Hostile Activity
    });
  });
});
