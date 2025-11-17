import sessionStatus from '../fixtures/session/default.json';

class LabsAndTests {
  setIntercepts = ({ labsAndTestData, useOhData = true }) => {
    cy.intercept('GET', '/my_health/v1/medical_records/imaging/status', [
      {
        status: 'COMPLETE',
        statusText: '100',
        studyIdUrn: '2184acee-280a-493b-91a1-c7914f3eaf98',
        percentComplete: 100,
        fileSize: '2.9 MB',
        fileSizeNumber: 8041789,
        startDate: 1720346400000,
        endDate: 1739568636000,
      },
    ]).as('imagingStatus');
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v2/medical_records/labs*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('start_date=');
        expect(req.url).to.contain('end_date=');

        // Extract and validate date parameter values (yyyy-mm-dd format)
        const url = new URL(req.url);
        const startDate = url.searchParams.get('start_date');
        const endDate = url.searchParams.get('end_date');

        expect(startDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(endDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
      }
      req.reply(labsAndTestData);
    }).as('labs-and-test-list');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
  };

  goToLabAndTestPage = () => {
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').click({
      waitForAnimations: true,
    });
  };

  checkTimeFrameDisplay = ({ fromDate, toDate }) => {
    const expectedText = `${fromDate} to ${toDate}`;

    // Assert the bold range text matches the expected year span
    cy.get('[data-testid="filter-display-message"]')
      .should('be.visible')
      .should('have.text', expectedText);
  };

  checkNoRecordsTimeFrameDisplay = ({ fromDate, toDate }) => {
    const expectedText = `${fromDate} to ${toDate}`;

    // Try the filter display first; if absent fall back to no-records message containing the range
    cy.get('body').then($body => {
      if ($body.find('[data-testid="filter-display-message"]').length) {
        cy.get('[data-testid="filter-display-message"]').should(
          'have.text',
          expectedText,
        );
      } else {
        // Empty state: ensure no-records message includes the expected range substring
        cy.get('[data-testid="no-records-message"]').should(
          'contain.text',
          expectedText,
        );
      }
    });
  };

  checkTimeFrameDisplayForYear = ({ year }) => {
    const fromDateText = `January 1, ${year}`;
    const toDateText = `December 31, ${year}`;

    this.checkTimeFrameDisplay({
      fromDate: fromDateText,
      toDate: toDateText,
    });
  };

  selectDateRange = ({ option }) => {
    cy.get('select[name="dateRangeSelector"]').select(option);
  };

  selectLabAndTest = ({ labName }) => {
    cy.contains(labName).click({ waitForAnimations: true });
    cy.get('[data-testid="lab-name"]').should('be.visible');
    cy.get('[data-testid="lab-name"]').contains(labName);
  };

  loadVAPaginationNext = () => {
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });
  };
}

export default new LabsAndTests();
