import { appName, rootUrl } from '../../manifest.json';

describe(`${appName} -- Redirect`, () => {
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // Need to skip the test until the content-build registry is updated to run the app.
  it.skip('Redirect from the root URL', () => {
    cy.visit(rootUrl);
    cy.url().should(
      'contain',
      '/health-care/order-hearing-aid-or-CPAP-supplies-form',
    );
    cy.url().should(
      'not.contain',
      '/my-health/order-hearing-aid-or-CPAP-supplies-form',
    );
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // Need to skip the test until the content-build registry is updated to run the app.
  it.skip('Redirect from a child URL', () => {
    cy.visit(`${rootUrl}/introduction`);
    cy.url().should(
      'contain',
      '/health-care/order-hearing-aid-or-CPAP-supplies-form/introduction',
    );
    cy.url().should(
      'not.contain',
      '/my-health/order-hearing-aid-or-CPAP-supplies-form',
    );
  });
});
