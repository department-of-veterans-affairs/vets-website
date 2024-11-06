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
