import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import ApiInitializer from './utilities/ApiInitializer';

/*
 * The intent of the tests in this file is to replicate the current state
 * of the landing page as it is in production.
 * As of 2/14/2024, the landing page is enabled, but the personalization is not.
 */
describe(`${appName} -- landing page`, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('displays an h1', () => {
    const heading = {
      level: 1,
      name: /^My HealtheVet$/,
    };
    cy.findByRole('heading', heading).should('have.focus');
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('renders the breadcrumbs', () => {
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('va-breadcrumbs')
      .shadow()
      .findByRole('link', { name: /My HealtheVet/ });
  });

  it('passes automated accessibility (a11y) checks', () => {
    cy.injectAxeThenAxeCheck();
  });
});
