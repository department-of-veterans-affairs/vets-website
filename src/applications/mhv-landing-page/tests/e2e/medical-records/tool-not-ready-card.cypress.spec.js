import { appName } from '../../../manifest.json';
import { defaultUser as user } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';
import { HEALTH_TOOL_HEADINGS, HEALTH_TOOL_LINKS } from '../../../constants';

const heading = HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS;

describe(`${appName} -- transitional Medical records card`, () => {
  it('renders with only the MR phase 1 feature toggle off', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    cy.login(user);
    cy.visit('/my-health');
    cy.findByTestId('mhv-mr-coming-soon-card').within(() => {
      cy.findByRole('heading', { level: 2, name: heading });
      cy.findByText(/^The new version of this tool isn’t ready yet./);
      cy.findByRole('link', { name: /^Go back to the previous version/ });
    });
    cy.injectAxeThenAxeCheck();
  });

  it('does not render with MR phase 1 feature toggle on', () => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health');
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { level: 2, name: heading });
    cy.findByRole('link', {
      name: HEALTH_TOOL_LINKS.MEDICAL_RECORDS[0].text,
    });
  });
});
