import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import { Data } from './utils/constants';

describe('Medications Refill Page Need Help Section', () => {
  it('visits Medications Refill Page Need Help Section', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyNeedHelpSectionOnRefillPage(Data.HELP_TEXT);
    refillPage.verifyGoToUseMedicationLinkOnRefillPage();
    refillPage.verifyStartANewMessageLinkOnRefillPage();
  });
});
