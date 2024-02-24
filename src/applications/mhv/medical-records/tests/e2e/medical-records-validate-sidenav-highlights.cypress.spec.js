import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import allergies from './fixtures/allergies.json';
import allergy from './fixtures/allergy.json';
import AllergiesListPage from './pages/AllergiesListPage';
import AllergyDetailsPage from './pages/AllergyDetailsPage';
import VaccinesListPage from './pages/VaccinesListPage';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import NotesListPage from './pages/NotesListPage';
import NotesDetailsPage from './pages/NotesDetailsPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';

describe('Medical Records Validate Sidenav Highlights', () => {
  it('Visits Medical Records View Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records');

    // navigate to allergies details page
    AllergiesListPage.clickGotoAllergiesLink(allergies);
    AllergyDetailsPage.clickAllergyDetailsLink('NUTS', 7006, allergy);
    cy.get('@allergyDetails.all').should('have.length', 0);
    // Verify allergies sidenav is highlighted
    AllergyDetailsPage.verifySidenavHighlightAllergies();

    // navigate to vaccines details page
    cy.visit('my-health/medical-records');
    VaccinesListPage.clickGotoVaccinesLink(defaultVaccines);
    VaccinesListPage.clickVaccinesDetailsLink(0, defaultVaccines.entry[0]);
    // verify vaccines sidenav is highlighted
    VaccineDetailsPage.verifySidenavHighlightVaccines();

    // navigate to care summaries and notes details page
    // cy.visit('my-health/medical-records');
    NotesListPage.clickGotoNotesLink();
    NotesDetailsPage.clickProgressNoteLink(4);
    NotesDetailsPage.verifySidenavHighlightNotes();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
