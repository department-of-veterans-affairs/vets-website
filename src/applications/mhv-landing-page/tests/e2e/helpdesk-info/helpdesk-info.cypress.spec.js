import { appName } from '../../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';
import { generateFeatureToggles } from '../../../mocks/api/feature-toggles';

describe(`${appName} - helpdesk information`, () => {
  describe('display content based on user status', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
    });

    it(`hides for unverified users with no facilities`, () => {
      LandingPage.visitPage({ loa: 1 });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`hides for verified users with no health data`, () => {
      LandingPage.visitPage({
        facilities: [],
        loa: 3,
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`shows for verified users with health data`, () => {
      LandingPage.visitPage({
        facilities: [{ facilityId: '123', isCerner: false }],
        loa: 3,
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });
  });

  describe('display content based on feature toggle', () => {
    it(`toggle is off`, () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          mhvHelpdeskInformationEnabled: false,
        }),
      ).as('featureToggles');
      LandingPage.visitPage({
        facilities: [{ facilityId: '123', isCerner: false }],
        loa: 3,
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should('not.exist');
    });

    it(`toggle is on`, () => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          mhvHelpdeskInformationEnabled: true,
        }),
      ).as('featureToggles');
      LandingPage.visitPage({
        facilities: [{ facilityId: '123', isCerner: false }],
        loa: 3,
      });
      LandingPage.validatePageLoaded();
      LandingPage.validateURL();
      cy.injectAxeThenAxeCheck();

      cy.findByTestId('mhv-helpdesk-info').should.exist;
    });
  });
});
