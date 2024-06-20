import MedicationsSite from './med_site/MedicationsSite';

describe.skip('Medications Login View', () => {
  it('visits Medications Login View', () => {
    const site = new MedicationsSite();

    site.login(false);
    site.verifyloadLogInModal();
    // site.login();
    // landingPage.visitLandingPageURL();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
