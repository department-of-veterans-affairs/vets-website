import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import singleCernerUser from './fixtures/cerner-user.json';
import { Data } from './utils/constants';

describe('Medications Landing Page Cerner User Alert and list Page Error', () => {
  it('visits cerner user my va health alert and Error for List of Prescriptions', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    site.cernerLogin(singleCernerUser);
    listPage.visitMedicationsListPageURL();
    landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage(
      Data.SINGLE_CERNER_FACILITY_USER,
    );
    landingPage.verifyErroMessageforFailedAPICallListPage();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
