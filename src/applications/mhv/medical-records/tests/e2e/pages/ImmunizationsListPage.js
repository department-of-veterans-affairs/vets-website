// import defaultImmunizations from '../fixtures/Immunizations.json';
import defaultImmunizations from '../../fixtures/vaccines.json';

class ImmunizationsListPage {
  clickGotoImmunizationsLink = (
    Immunizations = defaultImmunizations,
    waitForImmunizations = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/vaccines',
      Immunizations,
    ).as('ImmunizationsList');
    // cy.get('[href="/my-health/medical-records/vaccines"]').click();
    if (waitForImmunizations) {
      cy.wait('@ImmunizationsList');
    }
  };

  clickImmunizationsDetailsLink = (_ImmunizationsIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_ImmunizationsIndex)
      .click();
  };
}

export default new ImmunizationsListPage();
