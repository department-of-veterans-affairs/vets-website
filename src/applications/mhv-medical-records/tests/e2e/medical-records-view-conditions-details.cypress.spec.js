import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import ConditionDetailsPage from './pages/ConditionDetailsPage';
import ConditionsListPage from './pages/ConditionsListPage';
import ConditionDetailsPage from './pages/ConditionDetailsPage';
import conditions from './fixtures/conditions.json';

describe('Medical Records View Conditions', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Conditions Details', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // cy.visit('my-health/medical-records/conditions');
    ConditionsListPage.gotoConditionsListPage();
    ConditionsListPage.clickConditionsDetailsLink(1);
    ConditionDetailsPage.verifyTitle(conditions.entry[0].resource.code.text);

    ConditionDetailsPage.verifyProvider(
      // conditions.entry[0].resource.contained[0].name[0].text, // 'JOHN,SMITH'
      // 'SMITH JOHN',
      `${conditions.entry[0].resource.contained[0].name[0].given[0]} ${
        conditions.entry[0].resource.contained[0].name[0].family
      }`,
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
