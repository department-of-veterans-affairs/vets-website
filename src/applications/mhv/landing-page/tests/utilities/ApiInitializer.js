import { generateFeatureToggles } from '../../api/mocks/feature-toggles';
import userData from '../../api/mocks/user';
import { vamcEhrData } from '../../api/mocks/vamc-ehr';

class ApiInitializer {
  initializeVamcEhrData = {
    withSelectFacilities: () => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhrData);
    },
  };

  initializeFeatureToggle = {
    withAppDisabled: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({ mhvLandingPageEnabled: false }),
      );
    },
    withCurrentFeatures: () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({ mhvLandingPageEnabled: true }),
      );
    },
    withAllFeatures: () => {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
    },
  };

  initializeUserData = {
    withDefaultUser: () => {
      cy.intercept('GET', '/v0/user*', userData.defaultUser);
    },
    withCernerPatient: () => {
      cy.intercept('GET', '/v0/user*', userData.cernerUser);
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
