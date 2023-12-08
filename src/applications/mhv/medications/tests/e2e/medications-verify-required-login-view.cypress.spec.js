import MedicationsSite from './med_site/MedicationsSite';

describe('Medications Login View', () => {
  it('visits Medications Login View', () => {
    const site = new MedicationsSite();
    site.login(false);
    site.verifyloadLogInModal();
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
