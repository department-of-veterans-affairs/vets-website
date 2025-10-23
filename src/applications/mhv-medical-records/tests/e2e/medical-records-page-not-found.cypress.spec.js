import { rootUrl } from '../../manifest.json';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Page Not Found', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visit an unsupported URL and get a page not found', () => {
    // const site = new MedicalRecordsSite();
    // site.login();

    cy.visit(`${rootUrl}/path1`);
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="mhv-page-not-found"]').should('exist');
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');

    cy.visit(`${rootUrl}/path1/path2`);
    cy.get('[data-testid="mhv-page-not-found"]').should('exist');
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');
  });
});
