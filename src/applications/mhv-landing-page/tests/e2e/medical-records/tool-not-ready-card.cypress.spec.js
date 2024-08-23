import { appName } from '../../../manifest.json';
import { defaultUser as user } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';
import { HEALTH_TOOL_HEADINGS, HEALTH_TOOL_LINKS } from '../../../constants';

const heading = HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS;

describe(`${appName} -- transitional Medical records card`, () => {
  it('renders with only the transitional MR page feature toggle on', () => {
    ApiInitializer.initializeFeatureToggle.withFeatures({
      mhvTransitionalMedicalRecordsLandingPage: true,
      mhvIntegrationMedicalRecordsToPhase1: false,
    });
    cy.login(user);
    cy.visit('/my-health');
    cy.findByTestId('mhv-mr-coming-soon-card').within(() => {
      cy.findByRole('heading', { level: 2, name: heading });
      cy.findByText(/^The new version of this tool isn’t ready yet./);
      cy.findByRole('link', { name: /^Go back to the previous version/ });
    });
    cy.injectAxeThenAxeCheck();
  });

  describe(`does not render`, () => {
    const testForMRCard = () => {
      cy.login(user);
      cy.visit('/my-health');
      cy.findByRole('heading', { level: 2, name: heading });
      cy.findByRole('link', {
        name: HEALTH_TOOL_LINKS.MEDICAL_RECORDS[0].text,
      });
    };

    it('with MR phase 1 feature toggle on', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeatures();
      testForMRCard();
      cy.injectAxeThenAxeCheck();
    });

    it('with all feature toggles off', () => {
      ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
      testForMRCard();
      cy.injectAxeThenAxeCheck();
    });
  });
});
