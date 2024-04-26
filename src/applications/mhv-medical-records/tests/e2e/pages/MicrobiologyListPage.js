// import defaultMicrobiology from './fixtures/microbiology.json';
import BaseListPage from './BaseListPage';

class MicrobiologyListPage extends BaseListPage {
  /*
  clickGotoMicrobiologyLink = (
   Microbiology = defaultMicrobiology,
    waitForMicrobiology = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/Microbiology',
      Microbiology,
    ).as('MicrobiologyList');
    cy.get('[href="/my-health/medical-records/ex-MHV-labReport-1"]').click();
    if (waitForMicrobiology) {
      cy.wait('@MicrobiologyList');
    }
  };
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
