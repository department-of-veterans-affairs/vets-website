import featureToggles from '../../../mocks/feature-toggles';
import user from '../../../mocks/user';

describe('health-care-supplies-reordering - api failures - other', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      featureToggles.generateFeatureToggles({}),
    );
    cy.intercept('GET', '/v0/user', user.defaultUser);

    cy.intercept('GET', '/v0/in_progress_forms/mdot', req => {
      return req.reply(402, {});
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
  it('Form handles other error from in_progress_forms', () => {
    cy.login(user.defaultUser);
    cy.visit('/health-care/order-hearing-aid-or-CPAP-supplies-form');
    cy.injectAxeThenAxeCheck();
    cy.get('[slot=headline]').contains(
      'We’re sorry. Something went wrong on our end.',
    );
  });
});
