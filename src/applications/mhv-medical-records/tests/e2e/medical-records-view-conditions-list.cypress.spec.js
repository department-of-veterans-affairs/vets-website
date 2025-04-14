import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionsListPage from './pages/ConditionsListPage';
import conditions from './fixtures/conditions.json';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions List', () => {
    const site = new MedicalRecordsSite();
    site.login();
    ConditionsListPage.gotoConditionsListPage();

    ConditionsListPage.selectSort('Alphabetically');
    ConditionsListPage.verifyConditionTitleByIndex(
      0,
      conditions.entry[3].resource.code.text, // 'Acute posttraumatic stress disorder',
    );
    ConditionsListPage.verifyConditionTitleByIndex(
      3,
      conditions.entry[2].resource.code.text, // 'Restless Legs');
    );

    ConditionsListPage.selectSort('Newest to oldest (date entered)');
    ConditionsListPage.verifyConditionTitleByIndex(
      0,
      conditions.entry[1].resource.code.text, // 'CAD - Coronary Artery Disease',
    );
    ConditionsListPage.verifyConditionTitleByIndex(
      3,
      conditions.entry[2].resource.code.text, // 'Restless Legs');
    );

    ConditionsListPage.selectSort('Oldest to newest (date entered)');
    ConditionsListPage.verifyConditionTitleByIndex(
      0,
      conditions.entry[2].resource.code.text, // 'Restless Legs');
    );
    ConditionsListPage.verifyConditionTitleByIndex(
      3,
      conditions.entry[1].resource.code.text, // 'CAD - Coronary Artery Disease',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
