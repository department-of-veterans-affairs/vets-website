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
    VaccineDetailsPage.verifyVaccineNotes(VaccinesDetails);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
