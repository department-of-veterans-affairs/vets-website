import defaultAllergies from '../fixtures/allergies.json';

class AllergiesListPage {
  clickGotoAllergiesLink = (
    allergies = defaultAllergies,
    waitForAllergies = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/allergies',
      allergies,
    ).as('allergiesList');
    cy.get('[href="/my-health/medical-records/allergies"]').click();
    if (waitForAllergies) {
      cy.wait('@allergiesList');
    }
  };
}
export default new AllergiesListPage();
