import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page DropDown -- discontinued SM Compose Link', () => {
  it('verifies content of compose message link on discontinued meds', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
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
    listPage.clickGotoMedicationsLink(true);
    if (environment.BASE_URL.includes('localhost')) {
      cy.log('running localhost');
      cy.get('[data-testid="discontinued-compose-message-link"]')
        .invoke('attr', 'href')
        .should(
          'contain',
          'mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
        );
    } else {
      cy.log('running prod');
      cy.get('[data-testid="discontinued-compose-message-link"]')
        .invoke('attr', 'href')
        .should(
          'contain',
          'www.myhealth.va.gov/mhv-portal-web/secure-messaging',
        );
    }
  });
});
