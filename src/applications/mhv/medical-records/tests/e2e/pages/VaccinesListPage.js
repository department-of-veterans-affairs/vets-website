// import defaultVaccines from '../fixtures/Vaccines.json';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';
import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';

class VaccinesListPage {
  clickGotoVaccinesLink = (
    Vaccines = defaultVaccines,
    waitForVaccines = false,
  ) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines', Vaccines).as(
      'VaccinesList',
    );
    cy.get('[data-testid="vaccines-landing-page-link"]').click();
    if (waitForVaccines) {
      cy.wait('@VaccinesList');
    }
  };

  clickVaccinesDetailsLink = (
    _VaccinesIndex = 0,
    VaccinesDetails = defaultVaccineDetail,
    wait = false,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/vaccines/${VaccinesDetails.id}`,
      VaccinesDetails,
    ).as('vaccineDetails');
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VaccinesIndex)
      .click();
    if (wait) {
      cy.wait('@vaccineDetails');
    }
  };
}

export default new VaccinesListPage();
