// import defaultVaccines from '../fixtures/Vaccines.json';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';
// import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';
import BaseListPage from './BaseListPage';

class VaccinesListPage extends BaseListPage {
  goToVaccines = (vaccines = defaultVaccines, waitForVaccines = false) => {
    // cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    // cy.wait('@session');
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines', vaccines).as(
      'VaccinesList',
    );
    // cy.get('[data-testid="vaccines-landing-page-link"]').click();
    cy.visit('my-health/medical-records/vaccines');
    if (waitForVaccines) {
      cy.wait('@VaccinesList');
    }
  };

  clickVaccinesDetailsLink = (vaccinesIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(vaccinesIndex)
      .click();
  };
}

export default new VaccinesListPage();
