import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import VaccinesListPage from './pages/VaccinesListPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';
import VaccinesDetails from './fixtures/vaccines/vaccine-8261.json';

describe('Medical Records View Vaccines', () => {
  it('Visits Medical Records View Vaccine Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    VaccinesListPage.clickGotoVaccinesLink(defaultVaccines);
    VaccinesListPage.clickVaccinesDetailsLink(0, VaccinesDetails);
    VaccineDetailsPage.verifyVaccineName(VaccinesDetails);
    VaccineDetailsPage.verifyVaccineDate(VaccinesDetails);
    VaccineDetailsPage.verifyVaccineLocation(VaccinesDetails);
    VaccineDetailsPage.verifyVaccineNotes(VaccinesDetails, 0);
    VaccineDetailsPage.verifyVaccineNotes(VaccinesDetails, 1);
    // need to check manufacturer -- not in code 12/04/2023
    // Need to check Reactions -- not in code 12/04/2023

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
