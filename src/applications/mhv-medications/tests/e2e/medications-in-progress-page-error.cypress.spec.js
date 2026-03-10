import MedicationsSite from './med_site/MedicationsSite';
import MedicationsInProgressPage from './pages/MedicationsInProgressPage';

const errorResponse = {
  statusCode: 500,
  body: {
    errors: [
      {
        title: 'Internal server error',
        status: '500',
      },
    ],
  },
};

describe('In-progress medications page - API error', () => {
  it('displays an error notification when the prescriptions API fails', () => {
    const site = new MedicationsSite();
    site.loginWithManagementImprovements();

    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPageWithError(errorResponse);
    cy.wait('@prescriptionsError');

    inProgressPage.verifyHeading();
    inProgressPage.verifyApiErrorNotification();
    inProgressPage.verifyNeedHelpSection();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
