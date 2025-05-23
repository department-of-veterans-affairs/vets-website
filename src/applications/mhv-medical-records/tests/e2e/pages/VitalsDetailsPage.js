// import defaultVitals from '../fixtures/Vitals.json';
import BaseDetailsPage from './BaseDetailsPage';

class VitalsDetailsPage extends BaseDetailsPage {
  verifyVitalReadingByIndex = (
    index = 0,
    date,
    measurement,
    location,
    notes,
  ) => {
    // Verify date
    cy.get('[data-testid="vital-date"]')
      .eq(index)
      .should('be.visible');
    cy.get('[data-testid="vital-date"]')
      .eq(index)
      .contains(date);
    // Verify measurement
    cy.get('[data-testid="vital-result"]')
      .eq(index)
      .should('be.visible');
    cy.get('[data-testid="vital-result"]')
      .eq(index)
      .contains(measurement);
    // Verify location
    cy.get('[data-testid="vital-location"]')
      .eq(index)
      .should('be.visible');
    cy.get('[data-testid="vital-location"]')
      .eq(index)
      .contains(location);
    // Verify provider notes
    cy.get('[data-testid="vital-provider-note"]')
      .eq(index)
      .should('be.visible');
    cy.get('[data-testid="vital-provider-note"]')
      .eq(index)
      .contains(notes);
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

  clickBloodPressureLink = (bloodPressure = 0) => {
    // Click Vitals Page Blood Pressure Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(bloodPressure)
      .click();
  };

  clickHeartRateLink = (HeartRate = 1) => {
    // Click Vitals Page Heart Rate Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(HeartRate)
      .click();
  };

  clickWeightLink = (Weight = 2) => {
    // Click Vitals Page Weight Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(Weight)
      .click();
  };

  clickPainLink = (Pain = 3) => {
    // Click Vitals Page Blood Pressure Link
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(Pain)
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
