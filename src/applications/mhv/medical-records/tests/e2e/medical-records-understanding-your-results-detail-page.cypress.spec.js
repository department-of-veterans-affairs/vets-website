import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import LabsAndTestsDetailsPage from './pages/LabsAndTestsDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Understanding Your Results Detail Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });

  it('Understanding Your Results Chem/Hem, Microbiology, Pathology, and Radiology Detail Page', () => {
    // Given As a Medical Records User I wanted to Navigate to "Chemistry And Hematology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    // When I want to get "help to be able to understand results" of my MR data
    cy.get('[data-testid="understanding-result"]').click();
    // Results section will be styled to better help the user understand his test results
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-Alert-1"]').should('be.visible');
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-Alert-2"]').should('be.visible');
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-Alert-3"]').should('be.visible');
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');

    // Given As a Medical Records User I wanted to Navigate to "Microbiology" Detail Page
    // LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    // When I want to get "help to be able to understand results" of my MR data
    cy.get('[data-testid="understanding-result"]').click();
    // Results section will be styled to better help the user understand his test results
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-Alert-1"]').should('be.visible');
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-Alert-2"]').should('be.visible');
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-Alert-3"]').should('be.visible');
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');

    // Given As a Medical Records User I wanted to Navigate to "Pathology" Detail Page
    // LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    // When I want to get "help to be able to understand results" of my MR data
    cy.get('[data-testid="understanding-result"]').click();
    // Results section will be styled to better help the user understand his test results
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-Alert-1"]').should('be.visible');
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-Alert-2"]').should('be.visible');
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-Alert-3"]').should('be.visible');
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');

    // Given As a Medical Records User I wanted to Navigate to "Radiology" Detail Page
    // LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    // When I want to get "help to be able to understand results" of my MR data
    cy.get('[data-testid="understanding-result"]').click();
    // Results section will be styled to better help the user understand his test results
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-Alert-1"]').should('be.visible');
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-Alert-2"]').should('be.visible');
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-Alert-3"]').should('be.visible');
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');

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
