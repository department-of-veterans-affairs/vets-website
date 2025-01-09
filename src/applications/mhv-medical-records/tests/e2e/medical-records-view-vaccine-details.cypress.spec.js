import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import VaccinesListPage from './pages/VaccinesListPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    VaccinesListPage.goToVaccines(defaultVaccines);
  });

  it('View vaccine details, vaccine with full date', () => {
    VaccinesListPage.clickVaccinesDetailsLink(1);
    VaccineDetailsPage.verifyVaccineName(defaultVaccines.entry[0]);
    VaccineDetailsPage.verifyVaccineDate(defaultVaccines.entry[0]);
    VaccineDetailsPage.verifyVaccineLocation(defaultVaccines.entry[0]);
    // need to check manufacturer -- not in code 12/04/2023
    // Need to check Reactions -- not in code 12/04/2023

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('View vaccine details, vaccine date with year only', () => {
    VaccinesListPage.clickVaccinesDetailsLink(0);
    VaccineDetailsPage.verifyVaccineName(defaultVaccines.entry[12]);
    VaccineDetailsPage.verifyVaccineDateYearOnly(defaultVaccines.entry[12]);
    VaccineDetailsPage.verifyVaccineLocation(defaultVaccines.entry[12]);
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
