import { format, subMonths } from 'date-fns';
import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import labsAndTestData from '../fixtures/labsAndTests/multiple-pages.json';

describe('Medical Records Labs And Tests - Pagination Reset on Date Range Change', () => {
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
    LabsAndTests.setIntercepts({ labsAndTestData });
  });

  afterEach(() => {
    cy.clock().invoke('restore');
  });

  it('resets pagination to page 1 when date range changes', () => {
    site.loadPage();
    LabsAndTests.goToLabAndTestPage();

    // Verify initial load shows default date range
    const today = mockDate;
    const fromDisplay = format(subMonths(today, 3), 'MMMM d, yyyy');
    const toDisplay = format(today, 'MMMM d, yyyy');
    LabsAndTests.checkTimeFrameDisplay({
      fromDate: fromDisplay,
      toDate: toDisplay,
    });

    // Wait for initial data to load
    cy.wait('@labs-and-test-list');

    // Verify records are visible
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    // Verify pagination exists (fixture has 11 records, 3 per page = 4 pages)
    cy.get('va-pagination').should('exist');

    // Navigate to page 2 using pagination
    cy.get('va-pagination')
      .shadow()
      .find('.usa-pagination__button')
      .contains('2')
      .click({ waitForAnimations: true });

    // Verify URL shows page 2
    cy.url().should('include', 'page=2');

    // Verify we're on page 2 by checking the pagination display
    cy.get('va-pagination')
      .shadow()
      .find('.usa-current')
      .should('contain', '2');

    // Change the date range filter to a different year
    LabsAndTests.selectDateRange({
      option: '2023',
    });

    // Wait for API call with new date range
    cy.wait('@labs-and-test-list');

    // Verify URL has been reset to page 1 (or no page param)
    cy.url().should('not.include', 'page=2');
    cy.url().then(url => {
      // URL should either have page=1 or no page param at all
      expect(url).to.satisfy(
        currentUrl =>
          currentUrl.includes('page=1') || !currentUrl.includes('page='),
      );
    });

    // Verify the date range was updated
    LabsAndTests.checkTimeFrameDisplayForYear({ year: '2023' });

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });

  it('resets pagination when switching between multiple date ranges', () => {
    site.loadPage();
    LabsAndTests.goToLabAndTestPage();

    // Wait for initial load
    cy.wait('@labs-and-test-list');

    // Verify pagination exists
    cy.get('va-pagination').should('exist');

    // Navigate to page 2
    cy.get('va-pagination')
      .shadow()
      .find('.usa-pagination__button')
      .contains('2')
      .click({ waitForAnimations: true });

    cy.url().should('include', 'page=2');

    // Change to 2023
    LabsAndTests.selectDateRange({ option: '2023' });
    cy.wait('@labs-and-test-list');

    // Should not be on page 2 anymore
    cy.url().should('not.include', 'page=2');

    // Verify year changed
    LabsAndTests.checkTimeFrameDisplayForYear({ year: '2023' });

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });

  it('maintains page 1 when date range changes on page 1', () => {
    site.loadPage();
    LabsAndTests.goToLabAndTestPage();

    // Wait for initial load
    cy.wait('@labs-and-test-list');

    // User is already on page 1 (URL may or may not have page=1)
    cy.url().should('not.include', 'page=2');

    // Change date range
    LabsAndTests.selectDateRange({ option: '2023' });
    cy.wait('@labs-and-test-list');

    // Should still be on page 1 (not on page 2 or higher)
    cy.url().should('not.include', 'page=2');
    cy.url().should('not.include', 'page=3');

    // Verify date range changed
    LabsAndTests.checkTimeFrameDisplayForYear({ year: '2023' });

    // Verify records are shown
    cy.get('[data-testid="record-list-item"]').should('exist');

    // Accessibility check
    cy.injectAxeThenAxeCheck();
  });
});
