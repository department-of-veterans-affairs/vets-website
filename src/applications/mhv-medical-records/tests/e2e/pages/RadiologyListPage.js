// import defaultRadiology from '../fixtures/Radiology.json';

class RadiologyListPage {
  /*
  clickGotoRadiologyLink = (
   /* Radiology = defaultRadiology,
    waitForRadiology = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/radiology',
      Radiology,
    ).as('RadiologyList');
    cy.get('[href="/my-health/medical-records/radiology"]').click();
    if (waitForRadiology) {
      cy.wait('@RadiologyList');
    }
  });
}
*/

  clickRadiologyDetailsLink = (_radiologyIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_radiologyIndex)
      .click();
  };
}

export default new RadiologyListPage();
