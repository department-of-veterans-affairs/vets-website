import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { appName } from '../../../manifest.json';
import { defaultUser as user } from '../../../mocks/api/user';
import ApiInitializer from '../utilities/ApiInitializer';

describe(`${appName} -- transitional Medical Records page enabled`, () => {
  const pageHeading = 'Medical records';

  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAllFeatures();
    cy.login(user);
    cy.visit('/my-health/records');
  });

  it('renders', () => {
    cy.findByTestId('mhvMedicalRecords');
    cy.findByRole('heading', { level: 1, name: pageHeading }).should(
      'have.focus',
    );
    cy.title().should('match', new RegExp(pageHeading, 'i'));
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
    cy.findByRole('heading', { name: notFoundHeading });
    cy.injectAxeThenAxeCheck();
  });
});
