import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page DropDown -- discontinued SM Compose Link', () => {
  it('verifies content of compose message link on discontinued meds', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    cy.visit('my-health/about-medications/');
    site.login();

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
    listPage.clickGotoMedicationsLink(true);
    cy.get('[data-testid="compose-message-link"]')
      .invoke('attr', 'href')
      .should(
        'eq',
        'https://www.myhealth.va.gov/mhv-portal-web/secure-messaging',
      );
  });
});
