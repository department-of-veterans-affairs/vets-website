import { appName, rootUrl } from '../../manifest.json';
import user from '../fixtures/user.json';
import vamcEhr from '../fixtures/vamc-ehr.json';
import { generateFeatureToggles } from '../../mocks/api/feature-toggles';
import ApiInitializer from './utilities/ApiInitializer';

describe(`${appName} - landing page`, () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles()).as(
      'featureToggles',
    );
    cy.intercept('GET', '/data/cms/vamc-ehr.json', vamcEhr).as('vamcEhr');
  });

  it('display the landing page when visiting root URL', () => {
    ApiInitializer.initializeMessageData.withNoUnreadMessages();
    cy.login(user);
    cy.visit(rootUrl);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: /^My HealtheVet$/i }).should.exist;
    cy.findByRole('heading', { level: 2, name: /^Welcome/ }).should.exist;
  });

  it('display 404 page on unknown URLs', () => {
    cy.visit(`${rootUrl}/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: /we can’t find that page/i }).should.exist;
  });
});
