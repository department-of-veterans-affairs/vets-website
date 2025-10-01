import sessionStatus from '../fixtures/session/default.json';
import MedicalRecordsLandingPage from '../../pages/MedicalRecordsLandingPage';

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
    MedicalRecordsLandingPage.uumIntercept();
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

  checkUrl = ({ timeFrame }) => {
    cy.url().should('include', `?timeFrame=${timeFrame}`);
  };

  // Provide helper used by specs (mirrors former month+year picker API). Year-only UI ignores month.
  selectMonthAndYear = ({ month, year, submit = true }) => {
    cy.get('body').then($body => {
      if ($body.find('input[name="vitals-year-picker"]').length) {
        cy.get('input[name="vitals-year-picker"]').clear().type(year);
        if (submit) {
          cy.get('[data-testid="update-time-frame-button"]').click({
            waitForAnimations: true,
          });
        }
      } else {
        // Future fallback if month/year picker returns
        const monthValue = `${month}`;
        cy.get('va-date, va-date-picker').then($els => {
          if ($els.length) {
            cy.wrap($els.first())
              .shadow()
              .within(() => {
                const monthMap = {
                  january: '1',
                  february: '2',
                  march: '3',
                  april: '4',
                  may: '5',
                  june: '6',
                  july: '7',
                  august: '8',
                  september: '9',
                  october: '10',
                  november: '11',
                  december: '12',
                };
                const normalized = monthMap[monthValue.toString().toLowerCase()] || monthValue;
                cy.get('select[name="month"]').then($m => {
                  if ($m.length) cy.get('select[name="month"]').select(normalized);
                });
                cy.get('select[name="year"]').select(year.toString());
              });
            if (submit) {
              cy.get('[data-testid="update-time-frame-button"]').click({
                waitForAnimations: true,
              });
            }
          }
        });
      }
    });
  };

  selectYear = ({ year, submit = true }) => {
    cy.get('input[name="vitals-year-picker"]').clear();
    cy.get('input[name="vitals-year-picker"]').type(year);
    if (submit) {
      cy.get('[data-testid="update-time-frame-button"]').click({
        waitForAnimations: true,
      });
    }
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
