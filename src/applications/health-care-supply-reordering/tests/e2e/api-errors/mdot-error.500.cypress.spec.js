import featureToggles from '../../../mocks/feature-toggles';
import user from '../../../mocks/user';
import mdot from '../../../mocks/mdot';

describe('health-care-supplies-reordering - api failures - 500', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      featureToggles.generateFeatureToggles({}),
    );
    cy.intercept('GET', '/v0/user', user.defaultUser);

    cy.intercept('GET', '/v0/in_progress_forms/MDOT', req => {
      return req.reply(
        mdot.internalServerError.status,
        mdot.internalServerError.data,
      );
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Form handles 500 error from in_progress_forms', () => {
    cy.login(user.defaultUser);
    cy.visit('/health-care/order-hearing-aid-or-CPAP-supplies-form');
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="form-title"]');
    cy.get('.vads-c-action-link--green')
      .first()
      .click();

    cy.findByText(/Continue/i).click();
  });
});
