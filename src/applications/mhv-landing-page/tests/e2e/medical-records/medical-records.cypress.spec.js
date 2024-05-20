import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { appName } from '../../../manifest.json';
import user from '../../fixtures/user.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- transitional Medical Records page **enabled**`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health/records');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders', () => {
    cy.findByTestId('mhvMedicalRecords');
    cy.findByRole('heading', { level: 1, name: 'Medical records' });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- transitional Medical Records page **disabled**`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    cy.login(user);
    cy.visit('/my-health/records');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders not found page', () => {
    cy.findByRole('heading', { level: 3, name: notFoundHeading });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
