import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import { Data } from './utils/constants';
import multiFacilityCernerUser from './fixtures/cerner-user-multiple-facilities.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Refills Page Cerner Multiple Facility User', () => {
  it('visits cerner user my va health alert on refills page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const refillPage = new MedicationsRefillPage();
    site.cernerLogin(multiFacilityCernerUser);
    landingPage.visitLandingPageURL();
    refillPage.loadRefillPage();
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
