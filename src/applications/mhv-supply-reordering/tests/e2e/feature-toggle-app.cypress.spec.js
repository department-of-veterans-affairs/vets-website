import { appName, rootUrl } from '../../manifest.json';
import featureToggles from '../fixtures/mocks/feature_toggles.json';
import featureToggleDisabled from '../fixtures/mocks/feature_toggle_disabled.json';
import ipfMdotGetMock from '../fixtures/mocks/ipf_mdot_get.json';
import ipfMdotPutMock from '../fixtures/mocks/ipf_mdot_put.json';
import mdotSuppliesPostMock from '../fixtures/mocks/mdot_supplies_post.json';
import userMock from '../fixtures/mocks/user.json';

let heading;

describe(`${appName} -- feature toggol disabled`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggleDisabled);
    cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
    cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
    cy.intercept('POST', '/v0/mdot/supplies', mdotSuppliesPostMock);
    cy.intercept('GET', '/v0/user', userMock);
  });

  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('redirects to 404 page', () => {
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /^Page not found$/,
    };
    cy.location('pathname').should(
      'eq',
      '/my-health/order-medical-supplies/introduction',
    );
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should.exist;
    cy.findByRole('heading', heading).should('have.focus');
  });
});

describe(`${appName} -- feature toggol enabled`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('GET', '/v0/in_progress_forms/MDOT', ipfMdotGetMock);
    cy.intercept('PUT', '/v0/in_progress_forms/MDOT', ipfMdotPutMock);
    cy.intercept('POST', '/v0/mdot/supplies', mdotSuppliesPostMock);
    cy.intercept('GET', '/v0/user', userMock);
  });

  beforeEach(() => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
  });

  it('remains on mhv supply reodering app', () => {
    cy.injectAxeThenAxeCheck();
    heading = {
      level: 1,
      name: /^Medical supplies$/,
    };
    cy.location('pathname').should(
      'eq',
      '/my-health/order-medical-supplies/introduction',
    );
    cy.findByRole('navigation', { name: 'My HealtheVet' }).should.exist;
    cy.findByRole('heading', heading).should('have.focus');
  });
});
