import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionDetailsPage from './pages/ConditionDetailsPage';
import ConditionsListPage from './pages/ConditionsListPage';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/conditions');

    ConditionsListPage.verifyConditionsPageTitle();
    ConditionsListPage.clickConditionsDetailsLink(1);
    ConditionDetailsPage.verifyProvider('None noted');
    ConditionDetailsPage.verifyLocation('SLC10.FO-BAYPINES.MED.VA.GOV');
    ConditionDetailsPage.verifyProviderNotes("JOHN's test");
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
