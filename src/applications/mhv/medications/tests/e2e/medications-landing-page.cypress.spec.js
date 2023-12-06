import MedicationsSite from './med_site/MedicationsSite';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    site.login();
    cy.visit('my-health/about-medications/');

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
