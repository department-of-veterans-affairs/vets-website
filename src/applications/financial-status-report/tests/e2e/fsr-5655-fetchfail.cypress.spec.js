import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';

describe('Fetch Form Status Unsuccessfully', () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    });
    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.login(mockUser);

    cy.intercept('GET', '/v0/in_progress_forms/5655', req => {
      req.reply(500, { errors: [] });
    });
    cy.window().then(win => {
      win.localStorage.setItem('sessionExpiration', new Date().toString());
    });
    cy.visit(manifest.rootUrl);
  });
  after(() => {
    cy.window().then(win => {
      win.localStorage.removeItem('sessionExpiration');
    });
  });
  it('Unsuccessful API Response', () => {
    cy.get('[data-testid="server-error"] > h3').should(
      'have.text',
      'We’re sorry. Something went wrong on our end.',
    );

    cy.injectAxeThenAxeCheck();
  });
});
