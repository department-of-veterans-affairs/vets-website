import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import { Data } from './utils/constants';
import multiFacilityCernerUser from './fixtures/cerner-user-multiple-facilities.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Cerner Multiple Facility User', () => {
  it('visits cerner user my va health alert on list page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    site.cernerLogin(multiFacilityCernerUser);
    listPage.visitMedicationsListPageURL();
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
