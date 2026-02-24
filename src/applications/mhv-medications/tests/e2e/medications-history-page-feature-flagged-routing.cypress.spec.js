import MedicationsSite from './med_site/MedicationsSite';
import MedicationsHistoryPage from './pages/MedicationsHistoryPage';

describe('Medication History page', () => {
  const site = new MedicationsSite();

  beforeEach(() => {
    site.login();
  });

  it('renders page not found when feature flag is false', () => {
    const historyPage = new MedicationsHistoryPage();

    historyPage.visitPage();
    cy.findByTestId('mhv-page-not-found');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the medication history page when feature flag is true', () => {
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_medications_management_improvements',
            value: true,
          },
        ],
      },
    }).as('featureToggles');

    const historyPage = new MedicationsHistoryPage();

    historyPage.visitPage();
    historyPage.verifyHeading();
    cy.injectAxeThenAxeCheck();
  });
});
