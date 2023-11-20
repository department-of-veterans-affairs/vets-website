// import defaultMicrobiology from '../fixtures/Microbiology.json';

class MicrobiologyListPage {
  /*
  clickGotoMicrobiologyLink = (
   /* Microbiology = defaultMicrobiology,
    waitForMicrobiology = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/Microbiology',
      Microbiology,
    ).as('MicrobiologyList');
    cy.get('[href="/my-health/medical-records/Microbiology"]').click();
    if (waitForMicrobiology) {
      cy.wait('@MicrobiologyList');
    }
  });
}
*/

  clickMicrobiologyDetailsLink = (_MicrobiologyIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_MicrobiologyIndex)
      .click();
  };
}

export default new MicrobiologyListPage();
