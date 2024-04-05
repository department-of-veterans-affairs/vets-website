import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionDetailsPage from './pages/ConditionDetailsPage';
import ConditionsListPage from './pages/ConditionsListPage';

describe('Medical Records View Conditions', () => {
  it('Visits Medical Records View Conditions Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/conditions');

    ConditionsListPage.verifyConditionsPageTitle();
    ConditionsListPage.clickConditionsDetailsLink(0);
    ConditionDetailsPage.verifyProvider('JOHN,SMITH');
    ConditionDetailsPage.verifyLocation('DAYTON');
    ConditionDetailsPage.verifyProviderNotes('test');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
