// import defaultVitals from '../fixtures/Vitals.json';

class VitalsListPage {
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

  clickVitalsDetailsLink = (_VitalsIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_VitalsIndex)
      .click();
  };
}

export default new VitalsListPage();
