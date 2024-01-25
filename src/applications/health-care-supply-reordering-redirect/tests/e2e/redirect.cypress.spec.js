import { appName, rootUrl } from '../../manifest.json';
import targetUrl from '../../routes';

describe(`${appName} -- Redirect`, () => {
  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // Need to skip the test until the content-build registry is updated to run the app.
  it.skip('Redirect from the root URL', () => {
    cy.visit(rootUrl);
    cy.url().should('contain', rootUrl);
    cy.url().should('not.contain', targetUrl);
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  // Need to skip the test until the content-build registry is updated to run the app.
  it.skip('Redirect from a child URL', () => {
    cy.visit(`${rootUrl}/introduction`);
    cy.url().should('contain', `${targetUrl}/introduction`);
    cy.url().should('not.contain', rootUrl);
  });
});
