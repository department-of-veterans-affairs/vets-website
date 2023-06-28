import MedicationsSite from './med_site/MedicationsSite';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    cy.visit('my-health/medications/');
    site.login();
    cy.injectAxe();
    cy.axeCheck();
  });
});
