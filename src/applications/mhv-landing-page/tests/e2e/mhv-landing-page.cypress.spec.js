import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('Visit bad URL', () => {
    cy.visit(`${manifest.rootUrl}/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: notFoundHeading }).should.exist;
  });
});
