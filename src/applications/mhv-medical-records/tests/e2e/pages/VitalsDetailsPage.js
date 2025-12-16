// import defaultVitals from '../fixtures/Vitals.json';
import BaseDetailsPage from './BaseDetailsPage';

class VitalsDetailsPage extends BaseDetailsPage {
  waitForPageLoad = () => {
    // Wait for the vital details page to fully render
    cy.get('[data-testid="vital-date"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="vital-result"]').should('exist');
    cy.get('[data-testid="vital-location"]').should('exist');
    cy.get('[data-testid="vital-provider-note"]').should('exist');
  };

  verifyVitalReadingByIndex = (
    index = 0,
    date,
    measurement,
    location,
    notes,
  ) => {
    // Wait for enough elements to be rendered for the index we're checking
    cy.get('[data-testid="vital-date"]').should('have.length.gte', index + 1);
    // Verify date
    cy.get('[data-testid="vital-date"]')
      .eq(index)
      .should('be.visible')
      .and('contain', date);
    // Verify measurement
    cy.get('[data-testid="vital-result"]')
      .eq(index)
      .should('be.visible')
      .and('contain', measurement);
    // Verify location
    cy.get('[data-testid="vital-location"]')
      .eq(index)
      .should('be.visible')
      .and('contain', location);
    // Verify provider notes
    cy.get('[data-testid="vital-provider-note"]')
      .eq(index)
      .should('be.visible')
      .and('contain', notes);
  };

  verifyVitalsPageTitle = title => {
    // Verify "Vitals" Page title Text
    cy.get('[data-testid="vitals"]').should('be.visible');
    cy.get('[data-testid="vitals"]').contains(title);
  };

  clickBreadCrumbsLink = (breadcrumb = 0) => {
    // Click Back to "Vitals" Page
    cy.get('[data-testid="mr-breadcrumbs"]')
      .find('a')
      .eq(breadcrumb)
      .click();
  };

  verifyVitalDate = VitalDate => {
    // Verify Vital Date
    cy.get('[data-testid="vital-date"]').should('be.visible');
    cy.get('[data-testid="vital-date"]').contains(VitalDate);
  };

  verifyVitalResult = VitalResult => {
    // Verify Vital Result
    cy.get('[data-testid="vital-result"]').should('be.visible');
    cy.get('[data-testid="vital-result"]').contains(VitalResult);
  };

  verifyVitalLocation = VitalLocation => {
    // Verify Vital Details Location
    cy.get('[data-testid="vital-location"]').should('be.visible');
    cy.get('[data-testid="vital-location"]').contains(VitalLocation);
  };

  verifyVitalProviderNotes = VitalProviderNotes => {
    // Verify Vital Details Provider Notes
    cy.get('[data-testid="vital-provider-note"]').should('be.visible');
    cy.get('[data-testid="vital-provider-note"]').contains(VitalProviderNotes);
  };
}

export default new VitalsDetailsPage();
