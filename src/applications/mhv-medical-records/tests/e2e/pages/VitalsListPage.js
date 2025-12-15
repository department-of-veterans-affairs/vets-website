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
  };

  clickLinkByRecordListItem = vitalsHeading => {
    cy.contains(vitalsHeading, { includeShadowDom: true }).then(element => {
      cy.wrap(element).should('have.prop', 'tagName', 'H2');
      cy.wrap(element)
        .parent()
        .findByRole('link', { name: /Review your/ })
        .click();
    });
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
