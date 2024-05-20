import { appName } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';
import { HEALTH_TOOL_HEADINGS } from '../../../constants';

const heading = HEALTH_TOOL_HEADINGS.MEDICAL_RECORDS;

describe(`${appName} -- transitional Medical records card **enabled**`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders', () => {
    cy.findByRole('heading', { level: 2, name: heading });
    cy.findByText(/^The new version of this tool isn’t ready yet./);
    cy.findByRole('link', { name: /^Download your medical records/ });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- transitional Medical Records card **disabled**`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    cy.login(user);
    cy.visit('/my-health');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders not found page', () => {
    cy.findByRole('heading', { level: 2, name: heading });
    cy.findByRole('link', { name: 'Download medical record (Blue Button®)' });
    cy.findByRole('link', { name: 'Lab and test results' });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
