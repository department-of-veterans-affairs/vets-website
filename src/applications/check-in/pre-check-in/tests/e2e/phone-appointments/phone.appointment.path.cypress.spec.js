import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Confirmation from '../pages/Confirmation';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
      initializePreCheckInDataPost,
      initializeDemographicsPatch,
    } = ApiInitializer;
    initializeFeatureToggle.withAllFeatures();
    initializeDemographicsPatch.withSuccess();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataGet.withSuccess({
      uuid: '258d753c-262a-4ab2-b618-64b645884daf',
    });

    initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Happy Path yes to demographics', () => {
    cy.visitPreCheckInWithUUID('258d753c-262a-4ab2-b618-64b645884daf');
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    // page: Introduction
    Introduction.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    Introduction.validateAppointmentType('phone');
    Introduction.expandAccordion();
    cy.createScreenshots('Pre-check-in--Phone-appointment--Introduction');
    Introduction.attemptToGoToNextPage();

    // page: Demographics
    Demographics.validatePageLoaded();
    Demographics.attemptToGoToNextPage();

    // page: Emergency Contact
    EmergencyContact.validatePageLoaded();
    EmergencyContact.attemptToGoToNextPage();

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    NextOfKin.attemptToGoToNextPage();

    // page: Confirmation
    Confirmation.validatePageLoaded();
    Confirmation.validateAppointmentType('phone');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Pre-check-in--Phone-appointment--Confirmation-answer-yes-to-all--default-accordions',
    );
    Confirmation.expandAllAccordions();
    cy.createScreenshots(
      'Pre-check-in--Phone-appointment--Confirmation-answer-yes-to-all--expanded-accordions',
    );
  });
  it('Happy Path no to demographics', () => {
    cy.visitPreCheckInWithUUID('258d753c-262a-4ab2-b618-64b645884daf');
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    // page: Introduction
    Introduction.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    Introduction.attemptToGoToNextPage();

    // page: Demographics
    Demographics.validatePageLoaded();
    Demographics.attemptToGoToNextPage('no');

    // page: Emergency Contact
    EmergencyContact.validatePageLoaded();
    EmergencyContact.attemptToGoToNextPage('no');

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    NextOfKin.attemptToGoToNextPage('no');

    // page: Confirmation
    Confirmation.validatePageLoaded();

    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Pre-check-in--Phone-appointment--Confirmation-answer-no-to-all--default-accordions',
    );
    Confirmation.expandAllAccordions();
    cy.createScreenshots(
      'Pre-check-in--Phone-appointment--Confirmation-answer-no-to-all--expanded-accordions',
    );
  });
});
