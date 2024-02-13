import featureToggles from '../../../mocks/api/feature-toggles';
import userData from '../../../mocks/api/user';
import vamcEhr from '../../fixtures/vamc-ehr.json';
import {
  allFoldersWithUnreadMessages,
  oneFolderWithNoUnreadMessages,
} from '../../../mocks/api/mhv-api/messaging/folders/index';

class ApiInitializer {
  initializeFeatureToggle = {
    withAppDisabled: () => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: false,
        }),
      );
    },
    withCurrentFeatures: () => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: true,
          mhvLandingPagePersonalization: false,
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
        }),
      );
    },
    withFeatureDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPagePersonalization: false,
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
    withMHVTermsNotAccepted: () => {
      cy.intercept('GET', '/v0/user*', userData.mhvTermsNotAcceptedUser);
    },
    withCustomUser: customUserData => {
      cy.intercept('GET', '/v0/user*', customUserData);
    },
  };
}

export default new ApiInitializer();
