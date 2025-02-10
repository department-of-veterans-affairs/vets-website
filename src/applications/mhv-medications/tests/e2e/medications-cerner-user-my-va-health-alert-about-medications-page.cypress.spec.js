import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import { Data } from './utils/constants';
import singleCernerUser from './fixtures/cerner-user.json';

describe('Medications Landing Page Cerner User', () => {
  it('visits cerner user my va health alert on about medications page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.cernerLogin(singleCernerUser);
    landingPage.visitLandingPageURL();
    landingPage.verifyCernerUserMyVAHealthAlertOnAboutMedicationsPage(
      Data.SINGLE_CERNER_FACILITY_USER,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
