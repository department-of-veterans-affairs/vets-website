import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import VaccinesListPage from './pages/VaccinesListPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';

describe('Medical Records View Vaccines', () => {
  it('Visits Medical Records View Vaccine Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/');
    VaccinesListPage.clickGotoVaccinesLink(defaultVaccines);
    VaccinesListPage.clickVaccinesDetailsLink(0, defaultVaccines.entry[0]);
    cy.get('@vaccineDetails.all').should('have.length', 0);
    VaccineDetailsPage.verifyVaccineName(defaultVaccines.entry[0]);
    VaccineDetailsPage.verifyVaccineDate(defaultVaccines.entry[0]);
    VaccineDetailsPage.verifyVaccineLocation(defaultVaccines.entry[0]);
    VaccineDetailsPage.verifyVaccineNotes(defaultVaccines.entry[0], 0);
    VaccineDetailsPage.verifyVaccineNotes(defaultVaccines.entry[0], 1);
    // need to check manufacturer -- not in code 12/04/2023
    // Need to check Reactions -- not in code 12/04/2023

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
