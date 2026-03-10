import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications History Page Print Download Card', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'mhv_medications_management_improvements', value: true },
        ],
      },
    }).as('featureToggles');
    listPage.visitMedicationsListPageURL(rxList);
    cy.visit('/my-health/medications/history');
    cy.injectAxe();
  });

  it('should display the print download card with correct heading', () => {
    cy.axeCheck('main');
    cy.get('#print-download-heading').should(
      'contain',
      'Print or download your medications list',
    );
  });

  it('should display the print download select dropdown', () => {
    cy.get('va-card va-select[name="print-download-select"]').should('exist');
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select option')
      .should('have.length', 4);
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select option')
      .eq(0)
      .should('have.value', '');
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select option')
      .eq(1)
      .should('have.value', 'print');
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select option')
      .eq(2)
      .should('have.value', 'pdf');
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select option')
      .eq(3)
      .should('have.value', 'txt');
  });

  it('should show warning alert about public or shared computer', () => {
    cy.get('va-card va-alert[status="warning"]').should('exist');
    cy.get('va-card va-alert[status="warning"]').should(
      'contain',
      'If you’re on a public or shared computer,',
    );
  });

  it('should trigger print when print option is selected and submit is clicked', () => {
    cy.window().then(win => {
      cy.stub(win, 'print').as('print');
    });
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select')
      .select('print');
    cy.get('va-card va-button[text="Submit"]').click();
    cy.get('@print').should('have.been.called');
  });

  it('should download PDF when PDF option is selected and submit is clicked', () => {
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select')
      .select('pdf');
    cy.get('va-card va-button[text="Submit"]').click();
    cy.get('va-card va-alert[status="success"]').should('exist');
    cy.get('va-card va-alert[status="success"]').should(
      'contain',
      'Download started',
    );
  });

  it('should download TXT when TXT option is selected and submit is clicked', () => {
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select')
      .select('txt');
    cy.get('va-card va-button[text="Submit"]').click();
    cy.get('va-card va-alert[status="success"]').should('exist');
    cy.get('va-card va-alert[status="success"]').should(
      'contain',
      'Download started',
    );
  });

  it('should show error alert when download fails due to network issue', () => {
    cy.window().then(win => {
      cy.stub(win.navigator, 'onLine').value(false);
    });
    cy.get('va-card va-select[name="print-download-select"]')
      .shadow()
      .find('select')
      .select('pdf');
    cy.get('va-card va-button[text="Submit"]').click();
    cy.get('va-card va-alert[status="error"]').should('exist');
    cy.get('va-card va-alert[status="error"]').should(
      'contain',
      'Error Alert We can’t download your records right now',
    );
  });

  it('should pass accessibility checks on print download card', () => {
    cy.axeCheck('main');
  });
});
