// import defaultVitals from '../../fixtures/vitals.json';
import defaultVitals from '../fixtures/vitals.json';
import BaseListPage from './BaseListPage';

class VitalsListPage extends BaseListPage {
  goToVitals = (vitals = defaultVitals) => {
    // cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    // cy.wait('@session');
    cy.intercept('GET', '/my_health/v1/medical_records/vitals', vitals).as(
      'vitalsList',
    );
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.visit('my-health/medical-records/vitals');
    cy.wait([
      '@vitalsList',
      '@vamcEhr',
      '@mockUser',
      '@featureToggles',
      '@maintenanceWindow',
      '@status',
    ]);
    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');
  };

  clickLinkByRecordListItem = vitalsHeading => {
    // Wait for the vitals list to be fully rendered
    cy.get('[data-testid="vital-li-display-name"]').should('exist');

    // Find the card containing the heading and click its review link
    cy.contains('h2', vitalsHeading)
      .closest('[data-testid="record-list-item"]')
      .find('[data-testid="vital-li-review-over-time"]')
      .should('be.visible')
      .click();

    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');

    // Wait for the detail page to load after navigation
    cy.get('[data-testid="vital-date"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="vital-result"]').should('exist');
  };

  verifyVitalOnListPage = (index, name, measurement, date) => {
    cy.get('[data-testid="vital-li-display-name"]')
      .eq(index)
      .contains(name);
    cy.get('[data-testid="vital-li-measurement"]')
      .eq(index)
      .contains(measurement);
    cy.get('[data-testid="vital-li-date"]')
      .eq(index)
      .contains(date);
    cy.get('[data-testid="vital-li-review-over-time"]')
      .eq(index)
      .contains(`Review your ${name} over time`, { matchCase: false });
  };

  clickVitalsListNextButton = () => {
    cy.get('[aria-label="Next page"]')
      .find('a')
      .click();
  };

  loadVAPaginationNext = () => {
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });
  };

  loadVAPaginationPrevious = () => {
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__previous-page"]')
      .click({ waitForAnimations: true });
  };

  verifyFocusDisplayingRecords = recordsDisplaying => {
    cy.focused().should('have.text', recordsDisplaying);
  };
}

export default new VitalsListPage();
