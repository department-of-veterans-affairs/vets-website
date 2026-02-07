// import defaultVaccines from '../fixtures/Vaccines.json';
import defaultVaccines from '../fixtures/vaccines/vaccines.json';
// import defaultVaccineDetail from '../fixtures/vaccines/vaccine-8261.json';
import BaseListPage from './BaseListPage';

class VaccinesListPage extends BaseListPage {
  goToVaccinesPage = (page, vaccines = defaultVaccines) => {
    cy.intercept('GET', '/my_health/v1/medical_records/vaccines', vaccines).as(
      'VaccinesList',
    );
    const url =
      page != null
        ? `my-health/medical-records/vaccines?page=${page}`
        : 'my-health/medical-records/vaccines';
    cy.visit(url);
    cy.wait('@VaccinesList');
  };

  goToVaccines = (vaccines = defaultVaccines) => {
    this.goToVaccinesPage(null, vaccines);
  };

  clickVaccinesDetailsLink = (vaccinesIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .should('be.visible')
      .find('a')
      .eq(vaccinesIndex)
      .click();
  };

  clickBackToTopButtonOnListPage = () => {
    cy.get('[data-testid="mr-back-to-top"]')
      .should('exist')
      .and('be.visible');
    cy.get('[data-testid="mr-back-to-top"]', { includeShadowDom: true })
      .find('[class ="text"]')
      .click({ force: true });
  };

  verifyVaccinesListPageTitleIsFocused = () => {
    cy.get('h1')
      .contains('Vaccines')
      .should('be.visible')
      .and('be.focused');
  };
}

export default new VaccinesListPage();
