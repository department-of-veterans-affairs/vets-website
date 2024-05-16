import featureToggles from '../../../mocks/api/feature-toggles';
import userData from '../../../mocks/api/user';
import {
  allFoldersWithUnreadMessages,
  oneFolderWithNoUnreadMessages,
} from '../../../mocks/api/mhv-api/messaging/folders/index';

class ApiInitializer {
  initializeFeatureToggle = {
    withAppDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: false,
          mhvLandingPagePersonalization: false,
          mhvLandingPageEnableVaGovHealthToolsLinks: false,
          mhvTransitionalMedicalRecordsLandingPage: false,
        }),
      );
    },
    withCurrentFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: true,
          mhvLandingPagePersonalization: false,
          mhvLandingPageEnableVaGovHealthToolsLinks: false,
          mhvTransitionalMedicalRecordsLandingPage: false,
        }),
      );
    },
    withAllFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: true,
          mhvLandingPagePersonalization: true,
          mhvLandingPageEnableVaGovHealthToolsLinks: true,
          mhvTransitionalMedicalRecordsLandingPage: true,
        }),
      );
    },
  };

  initializeMessageData = {
    withUnreadMessages: () => {
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders*',
        allFoldersWithUnreadMessages,
      );
    },
    withNoUnreadMessages: () => {
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders*',
        oneFolderWithNoUnreadMessages,
      );
    },
  };

  initializeUserData = {
    withDefaultUser: () => {
      cy.intercept('GET', '/v0/user*', userData.defaultUser);
    },
    withCernerPatient: () => {
      cy.intercept('GET', '/v0/user*', userData.cernerPatient);
    },
    withFacilities: ({ facilities = [] }) => {
      cy.intercept(
        'GET',
        '/v0/user*',
        userData.generateUserWithFacilities({ facilities }),
      );
    },
    withMHVAccountState: mhvAccountState => {
      const userDataWithMHVAccountState = userData.generateUserWithMHVAccountState(
        mhvAccountState,
      );
      cy.intercept('GET', '/v0/user*', userDataWithMHVAccountState);
    },
  };
}

export default new ApiInitializer();
