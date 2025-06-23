import { appName, rootUrl } from '../../manifest.json';
import userMock from '../data/users/markUserData.json';

describe(`${appName} -- AppIsDown`, () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', { data: { features: [] } });
    cy.intercept('GET', '/v0/in_progress_forms/MDOT', {});
    cy.intercept('GET', '/v0/user', userMock);
  });

  it('displays notification when down', () => {
    cy.viewportPreset('va-top-mobile-1');
    cy.login(userMock);
    cy.visit(rootUrl);
    cy.findByText(/This application is down for maintenance/i);
    cy.injectAxeThenAxeCheck();
  });
});
