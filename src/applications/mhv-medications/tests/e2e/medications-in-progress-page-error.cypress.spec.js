import MedicationsSite from './med_site/MedicationsSite';
import MedicationsInProgressPage from './pages/MedicationsInProgressPage';
import mockToggles from './fixtures/toggles-response.json';

const setupIntercepts = (toggleNames = []) => {
  const toggles = JSON.parse(JSON.stringify(mockToggles));
  toggleNames.forEach(name => {
    const flag = toggles.data.features.find(f => f.name === name);
    if (flag) flag.value = true;
  });
  cy.intercept('GET', '/v0/feature_toggles?*', toggles).as('featureToggles');
};

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
  it('displays an error notification when the v1 prescriptions API fails', () => {
    const site = new MedicationsSite();
    site.login();
    setupIntercepts(['mhv_medications_management_improvements']);

    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPageWithError('v1', errorResponse);
    cy.wait('@prescriptionsError');

    inProgressPage.verifyHeading();
    inProgressPage.verifyApiErrorNotification();
    inProgressPage.verifyNeedHelpSection();

    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('displays an error notification when the v2 prescriptions API fails (Cerner pilot)', () => {
    const site = new MedicationsSite();
    site.login();
    setupIntercepts([
      'mhv_medications_management_improvements',
      'mhv_medications_cerner_pilot',
    ]);

    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPageWithError('v2', errorResponse);
    cy.wait('@prescriptionsError');

    inProgressPage.verifyHeading();
    inProgressPage.verifyApiErrorNotification();
    inProgressPage.verifyNeedHelpSection();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
