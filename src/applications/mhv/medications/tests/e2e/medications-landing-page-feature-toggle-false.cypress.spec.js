import MedicationsSite from './med_site/MedicationsSite';

describe.skip('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    site.login(true, false);
    cy.visit('my-health/about-medications/');

    cy.url().should('include', '/health-care/refill-track-prescriptions');

    site.login(true, true);
    cy.visit('my-health/about-medications/');
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
