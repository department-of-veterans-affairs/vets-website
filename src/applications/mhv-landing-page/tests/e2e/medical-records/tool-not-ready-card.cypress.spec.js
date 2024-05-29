import { appName } from '../../../manifest.json';
import { defaultUser as user } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';
import { HEALTH_TOOL_HEADINGS } from '../../../constants';

const heading = HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS;

describe(`${appName} -- transitional Medical records card enabled`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health');
  });

  it('renders', () => {
    cy.findByTestId('mhv-mr-coming-soon-card').within(() => {
      cy.findByRole('heading', { level: 2, name: heading });
      cy.findByText(/^The new version of this tool isn’t ready yet./);
      cy.findByRole('link', { name: /^Go back to the previous version/ });
    });

    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- transitional Medical Records card disabled`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    cy.login(user);
    cy.visit('/my-health');
  });

  it('renders MHV NP links', () => {
    cy.findByRole('heading', { level: 2, name: heading });
    cy.findByRole('link', { name: 'Download medical record (Blue Button®)' });
    cy.findByRole('link', { name: 'Lab and test results' });
    cy.injectAxeThenAxeCheck();
  });
});
