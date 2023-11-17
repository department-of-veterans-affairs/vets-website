// import defaultConditions from '../fixtures/Conditions.json';

class ConditionsListPage {
  /*
  clickGotoConditionsLink = (
   /* Conditions = defaultConditions,
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
  });
}
*/

  clickConditionsDetailsLink = (_conditionIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_conditionIndex)
      .click();
  };
}
export default new ConditionsListPage();
