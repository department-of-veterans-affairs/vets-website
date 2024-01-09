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
    ConditionDetailsPage.verifyConditionStatus('abc123');
    ConditionDetailsPage.verifyProvider('Dr. John');
    ConditionDetailsPage.verifyLocation("chiropractor's office");
    ConditionDetailsPage.verifySnomed('Back pain (SCT 161891005)');
    ConditionDetailsPage.verifyProviderNotes('A note');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
