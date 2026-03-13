import MedicationsSite from './med_site/MedicationsSite';
import MedicationsInProgressPage from './pages/MedicationsInProgressPage';
import inProgressPrescriptions from './fixtures/in-progress-prescriptions.json';

describe('In-progress medications page - successful data load (empty view)', () => {
  it('displays the empty view when there are no in-progress medications', () => {
    const site = new MedicationsSite();
    site.loginWithManagementImprovements();

    const emptyData = JSON.parse(JSON.stringify(inProgressPrescriptions));

    emptyData.data = [];
    emptyData.meta = {
      totalPages: 0,
      totalEntries: 0,
      ...emptyData.meta,
    };

    const inProgressPage = new MedicationsInProgressPage();
    inProgressPage.visitPage(emptyData);
    cy.wait('@prescriptions');

    inProgressPage.verifyHeading();
    inProgressPage.verifyEmptyViewCard();
    inProgressPage.verifyEmptyViewProcessListSteps();
    inProgressPage.verifyNeedHelpSection();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
