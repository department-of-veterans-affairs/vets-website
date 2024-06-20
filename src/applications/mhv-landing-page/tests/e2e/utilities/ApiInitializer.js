import featureToggles from '../../../mocks/api/feature-toggles';
import userData from '../../../mocks/api/user';
import {
  allFoldersWithUnreadMessages,
  oneFolderWithNoUnreadMessages,
} from '../../../mocks/api/mhv-api/messaging/folders/index';

class ApiInitializer {
  initializeFeatureToggle = {
    withAllFeaturesDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({ disableAll: true }),
      ).as('featureToggles');
    },
    withCurrentFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles(),
      ).as('featureToggles');
    },
    withAllFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({ enableAll: true }),
      ).as('featureToggles');
    },
  };

  initializeMessageData = {
    withUnreadMessages: () => {
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders*',
        allFoldersWithUnreadMessages,
      ).as('sm');
    },
    withNoUnreadMessages: () => {
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders*',
        oneFolderWithNoUnreadMessages,
      ).as('sm');
    },
  };

  initializeUserData = {
    withDefaultUser: () => {
      cy.intercept('GET', '/v0/user*', userData.defaultUser).as('user');
    },
    withMHVAccountState: mhvAccountState => {
      const userDataWithMHVAccountState = userData.generateUserWithMHVAccountState(
        mhvAccountState,
      );
      cy.intercept('GET', '/v0/user*', userDataWithMHVAccountState).as('user');
    },
  };
}

export default new ApiInitializer();
