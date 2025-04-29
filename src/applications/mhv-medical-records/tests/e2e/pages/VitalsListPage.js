// import defaultVitals from '../../fixtures/vitals.json';
import defaultVitals from '../fixtures/vitals.json';
import BaseListPage from './BaseListPage';

class VitalsListPage extends BaseListPage {
  /*
    clickGotoVitalsLink = (
     /* Vitals = defaultVitals,
      waitForVitals = false,
    ) => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/vitals',
        Vitals,
      ).as('VitalsList');
      cy.get('[href="/my-health/medical-records/vitals"]').click();
      if (waitForVitals) {
        cy.wait('@VitalsList');
      }
    });
  }
  */

  goToVitals = (vitals = defaultVitals, waitForVitals = false) => {
    // cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    // cy.wait('@session');
    cy.intercept('GET', '/my_health/v1/medical_records/vitals', vitals).as(
      'vitalsList',
    );
    cy.visit('my-health/medical-records/vitals');
    if (waitForVitals) {
      cy.wait('@vitalsList');
    }
  };

  clickLinkByRecordListItemIndex = (index = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(index)
      .click();
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

  clickVitalsDetailsLink = (_VitalsIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VitalsIndex)
      .click();
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
