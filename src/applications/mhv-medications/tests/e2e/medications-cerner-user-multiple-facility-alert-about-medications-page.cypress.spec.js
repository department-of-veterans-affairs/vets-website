import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import { Data } from './utils/constants';
import multiFacilityCernerUser from './fixtures/cerner-user-multiple-facilities.json';

describe('Medications Landing Page Cerner User', () => {
  it('visits cerner user my va health alert on about medications page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.cernerLogin(multiFacilityCernerUser);
    landingPage.visitLandingPageURL();
    landingPage.verifyMultipleCernerAlertTextOnABoutMedicationsPage(
      Data.MULTIPLE_CERNER_TEXT_ALERT,
    );
    landingPage.verifyMultipleCernerFacilityNamesAlertOnAboutMedicationsPage(
      Data.CERNER_FACILITY_ONE,
      Data.CERNER_FACILITY_TWO,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
