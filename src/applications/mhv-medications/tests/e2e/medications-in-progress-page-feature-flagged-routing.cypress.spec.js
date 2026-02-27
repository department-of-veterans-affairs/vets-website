import MedicationsSite from './med_site/MedicationsSite';
import MedicationsInProgressPage from './pages/MedicationsInProgressPage';

describe('In-progress medications page', () => {
  const site = new MedicationsSite();

  beforeEach(() => {
    site.login();
  });

  it('renders page not found when feature flag is false', () => {
    const inProgressPage = new MedicationsInProgressPage();

    inProgressPage.visitPage();
    cy.findByTestId('mhv-page-not-found');
    cy.injectAxeThenAxeCheck();
  });

  it('renders the in-progress medications page when feature flag is true', () => {
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

    const inProgressPage = new MedicationsInProgressPage();

    inProgressPage.visitPage();
    inProgressPage.verifyHeading();
    cy.injectAxeThenAxeCheck();
  });
});
