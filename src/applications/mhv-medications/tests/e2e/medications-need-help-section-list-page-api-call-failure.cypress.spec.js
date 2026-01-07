import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts, Data } from './utils/constants';

describe('Medications List Page Need Help Section API Call Failure', () => {
  it('visits Medications List Need Help Section', () => {
    const listPage = new MedicationsListPage();
    const site = new MedicationsSite();
    site.login();

    cy.intercept('GET', '/my_health/v1/prescriptions?*', {
      statusCode: 500,
      body: {
        errors: [
          {
            title: 'Internal Server Error',
            detail: 'An error occurred while processing your request.',
            status: '500',
          },
        ],
      },
    }).as('prescriptionsError');

    cy.visit('/my-health/medications');
    cy.wait('@prescriptionsError');

    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
    listPage.verifyGoToUseMedicationLinkOnListPage();
    listPage.verifyStartANewMessageLinkOnListPage();
    listPage.verifyErrorMessageforFailedAPICallListPage(
      Alerts.NO_ACCESS_TO_MEDICATIONS_ERROR,
    );

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
