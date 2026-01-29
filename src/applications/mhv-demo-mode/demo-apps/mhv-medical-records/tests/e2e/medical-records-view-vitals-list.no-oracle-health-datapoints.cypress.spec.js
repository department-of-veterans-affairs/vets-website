import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits View Vitals List - does not have Pain Severity', () => {
    VitalsListPage.goToVitals();

    // no pagination
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).should('not.exist');
    // no Pain severity
    cy.findByText('Pain severity').should('not.exist');

    // Axe check
    cy.injectAxeThenAxeCheck();
  });
});
