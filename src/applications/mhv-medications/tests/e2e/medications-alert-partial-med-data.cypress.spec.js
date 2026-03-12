import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import rxList from './fixtures/listOfPrescriptions.json';

const failedStationList = [
  { stationNumber: '442', stationName: 'CHEYENNE VA MEDICAL CENTER' },
  { stationNumber: '668', stationName: 'SPOKANE VA MEDICAL CENTER' },
];

const emptyRxListWithFailedStations = {
  data: [],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 0,
    },
    filterCount: {
      allMedications: 0,
      active: 0,
      recentlyRequested: 0,
      renewal: 0,
      nonActive: 0,
    },
    failedStationList,
    recentlyRequested: [],
    updatedAt: new Date().toISOString(),
  },
  links: {},
};

describe('Medications Failed Stations Alert', () => {
  it('displays error alert when no medications and stations failed', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(emptyRxListWithFailedStations);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.get('[data-testid="failed-stations-error"]').should('exist');
    cy.get('[data-testid="med-list"]').should('not.exist');
  });

  it('does not display failed stations alerts when no stations failed', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    cy.get('[data-testid="failed-stations-error"]').should('not.exist');
    cy.get('[data-testid="failed-stations-warning"]').should('not.exist');
    cy.get('[data-testid="med-list"]').should('exist');
  });
});
