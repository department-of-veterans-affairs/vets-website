import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';

describe('Medical Records View Lab and Tests', () => {
  const site = new MedicalRecordsSite();
  const mockDate = new Date(2024, 0, 25); // January 25, 2024
  beforeEach(() => {
    cy.clock(mockDate, ['Date']);

    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: false,
      isAcceleratingLabsAndTests: true,
    });
    LabsAndTests.setIntercepts({ labsAndTestData: [] });
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('Visits View Labs And Test Page List', () => {
    site.loadPage();

    // // check for MY Va Health links
    LabsAndTests.checkLandingPageLinks();

    LabsAndTests.goToLabAndTestPage();

    const today = mockDate;
    const fromDisplay = format(subMonths(today, 3), 'MMMM d, yyyy');
    const toDisplay = format(today, 'MMMM d, yyyy');
    LabsAndTests.checkNoRecordsTimeFrameDisplay({
      fromDate: fromDisplay,
      toDate: toDisplay,
    });

    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="no-records-message"]').should('be.visible');
    cy.get('[data-testid="no-records-message"]').should(
      'contain.text',
      `There are no lab and test results in your VA medical records for`,
    );
  });
});
