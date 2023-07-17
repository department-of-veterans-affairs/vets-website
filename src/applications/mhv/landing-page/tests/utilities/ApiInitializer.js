import featureToggles from '../../api/mocks/feature-toggles';
import userData from '../../api/mocks/user';

class ApiInitializer {
  initializeFeatureToggle = {
    withAppDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: false,
        }),
      );
    },
    withCurrentFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: true,
        }),
      );
    },
    withAllFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        featureToggles.generateFeatureToggles({
          mhvLandingPageEnabled: true,
        }),
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
  };
}

export default new ApiInitializer();
