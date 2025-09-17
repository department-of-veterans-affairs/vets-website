import defaultConditions from '../fixtures/conditions.json';
import BaseListPage from './BaseListPage';

class ConditionsListPage extends BaseListPage {
  // clickGotoConditionsLink = (
  //   conditions = defaultConditions,
  //   waitForConditions = false,
  // ) => {
  //   cy.intercept(
  //     'GET',
  //     '/my_health/v1/medical_records/conditions',
  //     conditions,
  //   ).as('ConditionsList');
  //   // cy.get('[href="/my-health/medical-records/conditions"]').click();
  //   cy.visit('my-health/medical-records/conditions');
  //   if (waitForConditions) {
  //     cy.wait('@ConditionsList');
  //   }
  // };

  gotoConditionsListPage = (conditions = defaultConditions) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/conditions',
      conditions,
    ).as('ConditionsList');
    // cy.get('[href="/my-health/medical-records/conditions"]').click();
    cy.visit('my-health/medical-records/conditions');
    cy.wait('@ConditionsList');
  };

  verifyConditionsPageTitle = () => {
    // Verify Conditions Page Title
    cy.get('[data-testid="health-conditions"]').should('be.visible');
  };

  clickConditionsDetailsLink = (_conditionIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .find('a')
      .eq(_conditionIndex)
      .click();
  };
}
export default new ConditionsListPage();
