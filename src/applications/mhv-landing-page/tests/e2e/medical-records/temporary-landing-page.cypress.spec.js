import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { appName } from '../../../manifest.json';
import { defaultUser as user } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- transitional Medical Records page enabled`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health/records');
  });

  it('renders', () => {
    cy.findByTestId('mhvMedicalRecords');
    cy.findByRole('heading', { level: 1, name: 'Medical records' });
    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- transitional Medical Records page disabled`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeaturesDisabled();
    cy.login(user);
    cy.visit('/my-health/records');
  });

  it('renders not found page', () => {
    cy.findByRole('heading', { level: 3, name: notFoundHeading });
    cy.injectAxeThenAxeCheck();
  });
});
