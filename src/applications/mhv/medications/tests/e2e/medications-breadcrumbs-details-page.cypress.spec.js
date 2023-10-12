import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Breadcrumbs', () => {
  it('visits Medications Details Page Breadcrumbs', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    cy.visit('my-health/about-medications/');
    site.login();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.clickMedicationsBreadcrumbsOnDetailsPage();
    landingPage.verifyNavigationToLandingPageAfterClickingBreadcrumb();
    // listPage.verifyNavigationToListPageAfterClickingBreadcrumbMedications();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
