import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import ConditionDetailsPage from './pages/ConditionDetailsPage';
import ConditionsListPage from './pages/ConditionsListPage';
import ConditionDetailsPage from './pages/ConditionDetailsPage';
import conditions from './fixtures/conditions.json';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // cy.visit('my-health/medical-records/conditions');
    ConditionsListPage.gotoConditionsListPage();
    ConditionsListPage.clickConditionsDetailsLink(1);

    ConditionDetailsPage.verifyProvider(
      conditions.entry[0].resource.contained[0].name[0].text, // 'JOHN,SMITH'
    );
    ConditionDetailsPage.verifyLocation(
      conditions.entry[0].resource.contained[1].name, // 'DAYTON'
    );
    // ConditionDetailsPage.verifyProviderNotes(
    //   conditions.entry[0].resource.note[0],
    // );
    ConditionDetailsPage.verifyProviderNotesList(
      conditions.entry[0].resource.note[0].text,
    );
    ConditionDetailsPage.verifyProviderNotesList(
      conditions.entry[0].resource.note[1].text,
    );
    ConditionDetailsPage.verifyProviderNotesList(
      conditions.entry[0].resource.note[2].text,
    );
    ConditionDetailsPage.verifyProviderNotesList(
      conditions.entry[0].resource.note[3].text,
    );
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
