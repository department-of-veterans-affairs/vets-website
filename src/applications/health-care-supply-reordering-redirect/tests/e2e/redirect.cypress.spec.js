import { appName, rootUrl } from '../../manifest.json';

describe(`${appName} -- Redirect`, () => {
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('Redirect from the root URL', () => {
    cy.visit(rootUrl);
    cy.url().should(
      'contain',
      '/health-care/order-hearing-aid-or-CPAP-supplies-form',
    );
    cy.url().should('not.contain', rootUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('Redirect from a child URL', () => {
    cy.visit(`${rootUrl}/introduction`);
    cy.url().should(
      'contain',
      '/health-care/order-hearing-aid-or-CPAP-supplies-form/introduction',
    );
    cy.url().should('not.contain', rootUrl);
  });
});
