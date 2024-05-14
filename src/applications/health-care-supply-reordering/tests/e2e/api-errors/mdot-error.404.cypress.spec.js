import featureToggles from '../../../mocks/feature-toggles';
import user from '../../../mocks/user';
import mdot from '../../../mocks/mdot';

describe('health-care-supplies-reordering - api failures - 404', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      featureToggles.generateFeatureToggles({}),
    );
    cy.intercept('GET', '/v0/user', user.defaultUser);

    cy.intercept('GET', '/v0/in_progress_forms/mdot', req => {
      return req.reply(
        mdot.veteranNotFoundResponse.status,
        mdot.veteranNotFoundResponse.data,
      );
    });
    cy.window().then(win => {
      win.localStorage.setItem('sessionExpiration', new Date().toString());
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Form handles 404 error from in_progress_forms', () => {
    cy.login(user.defaultUser);
    cy.visit('/health-care/order-hearing-aid-or-CPAP-supplies-form');
    cy.injectAxeThenAxeCheck();
    cy.get('[slot=headline]').contains(
      'We can’t find your records in our system',
    );
  });
});
