import { appName, rootUrl } from '../../manifest.json';
import ApiInitializer from './utilities/ApiInitializer';
import user from '../fixtures/user.json';

describe(`${appName} -- not found`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    cy.login(user);
    cy.visit(`${rootUrl}/not-found`);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders a loading indicator', () => {
    cy.findByTestId('mhv-page-not-found--loading');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders', () => {
    cy.findByRole('navigation', { name: 'My HealtheVet' });
    cy.findByTestId('mhv-page-not-found');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});

describe(`${appName} -- not found -- unauthenticated`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    cy.visit(`${rootUrl}/pizza`);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders', () => {
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should('not.exist');
    cy.findByTestId('mhv-page-not-found');
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
