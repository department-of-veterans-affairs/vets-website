import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Medication Information Print This Page DropDown', () => {
  it('visits Medications Details Page Medication Information Print This Page DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.clickLearnMoreAboutMedicationLinkOnDetailsPage(
      rxTrackingDetails.data.attributes.prescriptionId,
    );
    detailsPage.verifyPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.clickPrintOrDownloadDropDownButtonOnMedicationInformationPage();
    detailsPage.verifyPrintThisPageDropDownOptionOnMedicationInformationPage();
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });
    cy.get('[data-testid="download-print-button"]').click();
    cy.get('@print').should('have.been.called');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
