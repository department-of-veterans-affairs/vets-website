// import defaultConditions from '../fixtures/Conditions.json';
import BaseListPage from './BaseListPage';

class ConditionsListPage extends BaseListPage {
  /*
  clickGotoConditionsLink = (
   Conditions = defaultConditions,
    waitForConditions = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/Conditions',
      Conditions,
    ).as('ConditionsList');
    cy.get('[href="/my-health/medical-records/Conditions"]').click();
    if (waitForConditions) {
      cy.wait('@ConditionsList');
    }
  };

*/

  verifyConditionsPageTitle = () => {
    // Verify Conditions Page Title
    cy.get('[data-testid="health-conditions"]').should('be.visible');
  };

  clickConditionsDetailsLink = (_conditionIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_conditionIndex)
      .click();
  };
}
export default new ConditionsListPage();
