import sessionStatus from '../fixtures/session/default.json';

class CareSummaryAndNotes {
  setIntercepts = ({ careSummaryAndNotesData }) => {
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

    // List endpoint — glob '*' does not match '/', so this only handles the list URL
    cy.intercept(
      'GET',
      '/my_health/v2/medical_records/clinical_notes*',
      req => {
        req.reply(careSummaryAndNotesData);
      },
    ).as('clinical_notes-list');

    // Single-note endpoint for oracle-health notes that need a separate detail fetch
    cy.intercept(
      'GET',
      /\/my_health\/v2\/medical_records\/clinical_notes\/[^/]+/,
      req => {
        const urlObj = new URL(req.url, 'http://localhost');
        const pathParts = urlObj.pathname.split('/');
        const noteId = pathParts[pathParts.length - 1];
        const allNotes = careSummaryAndNotesData?.data || [];
        const note = allNotes.find(n => n.id === noteId);
        req.reply({ data: note || {} });
      },
    ).as('clinical_note-detail');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="notes-landing-page-link"]').should('be.visible');
  };

  goToCareSummaryAndNotesPage = () => {
    cy.get('[data-testid="notes-landing-page-link"]').should('be.visible');
    cy.get('[data-testid="notes-landing-page-link"]').click({
      waitForAnimations: true,
    });
    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');
  };

  checkInfoAlert = () => {
    // Alert removed from Care Summaries page — assert it does not render
    cy.get('body')
      .find('[data-testid="cerner-facilities-info-alert"]')
      .should('not.exist');
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

  selectCareSummaryOrNote = ({ index = 1 } = {}) => {
    cy.get(
      `ul.record-list-items.no-print > :nth-child(${index}) [data-testid="note-name"]`,
    )
      .first()
      .click({ waitForAnimations: true });
  };

  loadVAPaginationNext = () => {
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });
  };

  checkDischargeListItem = ({ index = 1, title = 'Clinical Summary' } = {}) => {
    cy.get(
      `ul.record-list-items.no-print > :nth-child(${index}) [data-testid="record-list-item"]`,
    ).should('contain.text', 'Discharged');
    cy.get(
      `ul.record-list-items.no-print > :nth-child(${index}) .vads-u-font-weight--bold`,
    ).should('contain.text', title);
  };

  checkNoteListItem = ({
    index = 2,
    title = 'Inpatient Discharge Instructions - VA',
  } = {}) => {
    cy.get(
      `ul.record-list-items.no-print > :nth-child(${index}) [data-testid="record-list-item"]`,
    ).should('contain.text', 'Written by');
    cy.get(
      `ul.record-list-items.no-print > :nth-child(${index}) .vads-u-font-weight--bold`,
    ).should('contain.text', title);
  };

  validateNoteDetailPage = ({
    title = 'Inpatient Discharge Instructions - VA',
    headerDate = 'July 29, 2025',
    location = '668 Mann-Grandstaff WA VA Medical Center',
    writtenBy = 'Victoria A Borland',
    signedBy = 'Victoria A Borland',
    dateSigned = 'None recorded',
    summaryText = 'Inpatient Discharge Instructions - VA * Final Report *',
  } = {}) => {
    cy.get('[data-testid="progress-note-name"]').should('be.visible');
    cy.get('[data-testid="progress-note-name"]').should('contain', title);
    cy.get('[data-testid="header-time"]').should('contain', headerDate);
    cy.get('[data-testid="progress-location"]').should('contain', location);
    cy.get('[data-testid="note-record-written-by"]').should(
      'contain',
      writtenBy,
    );
    cy.get('[data-testid="note-record-signed-by"]').should('contain', signedBy);
    cy.get('[data-testid="progress-signed-date"]').should(
      'contain',
      dateSigned,
    );
    cy.get('[data-testid="note-record"]').should('contain', summaryText);
  };

  validateDischargeDetailPage = ({
    title = 'Clinical Summary',
    headerDate = 'July 29, 2025',
    location = '668 Mann-Grandstaff WA VA Medical Center',
    dateAdmitted = 'July 29, 2025',
    dateDischarged = 'N/A',
    dischargedBy = 'Victoria A Borland',
    summaryText = 'Clinical Summary * Final Report * Name:SILVA, ALEXANDER',
  } = {}) => {
    cy.get('p.vads-u-margin-bottom--0').should('contain', 'discharge');
    cy.get('[data-testid="admission-discharge-name"]').should('contain', title);
    cy.get('[data-testid="header-time"]').should('contain', headerDate);
    cy.get('[data-testid="note-record-location"]').should('contain', location);
    cy.get('[data-testid="note-admission-date"]').should(
      'contain',
      dateAdmitted,
    );
    cy.get('[data-testid="note-discharge-date"]').should(
      'contain',
      dateDischarged,
    );
    cy.get('[data-testid="note-discharged-by"]').should(
      'contain',
      dischargedBy,
    );
    cy.get('[data-testid="note-summary"]').should('contain', summaryText);
  };
}

export default new CareSummaryAndNotes();
