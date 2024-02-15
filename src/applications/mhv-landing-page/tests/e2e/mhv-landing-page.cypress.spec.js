import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import { generateFeatureToggles } from '../../mocks/api/feature-toggles';
import ApiInitializer from './utilities/ApiInitializer';

/*
 * The intent of the tests in this file is to replicate the current state
 * of the landing page as it is in production.
 * As of 2/14/2024, the landing page is enabled, but the personalization is not.
 */
describe(`${appName} - landing page`, () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        mhvLandingPageEnabled: true,
        mhvLandingPagePersonalization: false,
      }),
    ).as('featureToggles');
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
  });

  it('display the landing page', () => {
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: notFoundHeading }).should.exist;
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should(
      'not.exist',
    );
  });
});
