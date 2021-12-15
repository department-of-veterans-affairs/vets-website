import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import SeeStaff from '../pages/SeeStaff';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';

describe('Check In Experience -- ', () => {
  describe('See Staff display -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      cy.getAppointments();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceMultipleAppointmentSupport: true,
          checkInExperienceUpdateInformationPageEnabled: false,
          checkInExperienceDemographicsPageEnabled: true,
          emergencyContactEnabled: true,
          checkInExperienceNextOfKinEnabled: true,
        }),
      );
      cy.visitWithUUID();
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff display with demographics message', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage();
      cy.injectAxe();
      cy.axeCheck();
    });
    it('see staff page has BTSSS link', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateBTSSSLink();
    });
    it('back link goes back to previous page', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateBackButton();
    });
    it('see staff display with next of kin message', () => {
      Demographics.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage(
        'Our staff can help you update your emergency contact information.',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
    it('see staff display with emergency contact message', () => {
      Demographics.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage(
        'Our staff can help you update your emergency contact information.',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
