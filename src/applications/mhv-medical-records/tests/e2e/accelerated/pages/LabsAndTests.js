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

  /**
   * Set up intercepts for accelerated imaging study endpoints (v2).
   * @param {Object} options
   * @param {Array} options.imagingStudiesData - Fixture for GET /v2/medical_records/imaging
   * @param {Array} options.thumbnailsData - Fixture for GET /v2/medical_records/imaging/:id/thumbnails
   * @param {Array} options.dicomData - Fixture for GET /v2/medical_records/imaging/:id/dicom
   * @param {number} [options.thumbnailsStatusCode=200] - Status code for thumbnails response
   */
  setImagingIntercepts = ({
    imagingStudiesData = [],
    thumbnailsData = [],
    dicomData = [],
    thumbnailsStatusCode = 200,
  } = {}) => {
    cy.intercept('GET', '/my_health/v2/medical_records/imaging?*', {
      statusCode: 200,
      body: imagingStudiesData,
    }).as('imagingStudies');

    cy.intercept('GET', '/my_health/v2/medical_records/imaging/*/thumbnails', {
      statusCode: thumbnailsStatusCode,
      body: thumbnailsStatusCode === 200 ? thumbnailsData : {},
    }).as('imagingThumbnails');

    cy.intercept('GET', '/my_health/v2/medical_records/imaging/*/dicom', {
      statusCode: 200,
      body: dicomData,
    }).as('imagingDicom');

    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/bbmi_notification/status',
      {
        statusCode: 200,
        body: { flag: true },
      },
    ).as('bbmiNotification');
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
    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');
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

  // --- Unified Radiology Detail methods ---

  selectRadiologyRecord = ({ labName }) => {
    // Wait for the list to render, then click the record link
    cy.get('[data-testid="record-list-item"]', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0,
    );
    cy.get('[data-testid="record-list-item"]')
      .contains(labName)
      .click({ waitForAnimations: true });
    // Wait for the detail page to finish loading
    cy.get('[data-testid="loading-indicator"]').should('not.exist');
    cy.get('[data-testid="radiology-name"]', { timeout: 10000 }).should(
      'be.visible',
    );
  };

  verifyRadiologyDetailFields = ({ name, testCode, location, orderedBy }) => {
    if (name) {
      cy.get('[data-testid="radiology-name"]').should('contain.text', name);
    }
    if (testCode) {
      cy.get('[data-testid="radiology-test-code"]').should(
        'contain.text',
        testCode,
      );
    }
    if (location) {
      cy.get('[data-testid="radiology-collecting-location"]').should(
        'contain.text',
        location,
      );
    }
    if (orderedBy) {
      cy.get('[data-testid="radiology-ordered-by"]').should(
        'contain.text',
        orderedBy,
      );
    }
  };

  verifyImagesLoadingSpinner = () => {
    cy.get('[data-testid="radiology-images-loading"]').should('exist');
  };

  verifyViewAllImagesLink = ({ imageCount }) => {
    cy.get('[data-testid="radiology-view-all-images"]').should('be.visible');
    if (imageCount) {
      cy.get('[data-testid="radiology-view-all-images"]').should(
        'contain.text',
        `${imageCount}`,
      );
    }
  };

  verifyImageErrorAlert = () => {
    cy.get('[data-testid="image-request-error-alert"]').should('be.visible');
  };

  clickViewAllImages = () => {
    cy.get('[data-testid="radiology-view-all-images"]').click({
      waitForAnimations: true,
    });
  };

  // --- SCDF Images List page methods ---

  verifyImagesPageHeading = ({ name }) => {
    cy.get('h1')
      .should('be.visible')
      .and('contain.text', `Images: ${name}`);
  };

  verifyImageGalleryCount = ({ count }) => {
    cy.get('.image-div img', { timeout: 10000 }).should('have.length', count);
  };

  verifyDicomDownloadLink = () => {
    cy.get('va-link[text="Download DICOM files"]').should('exist');
  };
}

export default new LabsAndTests();
