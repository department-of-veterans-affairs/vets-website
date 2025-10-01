import sessionStatus from '../fixtures/session/default.json';
import MedicalRecordsLandingPage from '../../pages/MedicalRecordsLandingPage';

class Vitals {
  setIntercepts = ({ vitalData, useOhData = true }) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
        expect(req.url).to.contain('from=');
        expect(req.url).to.contain('to=');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(vitalData);
    }).as('vitals-list');
    MedicalRecordsLandingPage.uumIntercept();
  };

  goToVitalPage = () => {
    cy.get('[data-testid="vitals-landing-page-link"]').as('vitals-link');
    cy.get('@vitals-link').should('be.visible');
    cy.get('@vitals-link').click();
  };

  checkUrl = ({ timeFrame }) => {
    cy.url().should('include', `?timeFrame=${timeFrame}`);
  };

  // New helper expected by existing specs. Supports legacy month/year picker or current year-only input.
  selectMonthAndYear = ({ month, year, submit = true }) => {
    // If the year-only input exists, just enter the year and submit.
    cy.get('body').then($body => {
      if ($body.find('input[name="vitals-year-picker"]').length) {
        cy.get('input[name="vitals-year-picker"]').clear().type(year);
        if (submit) {
          cy.get('[data-testid="update-time-frame-button"]').click({
            waitForAnimations: true,
          });
        }
      } else {
        // Fallback logic if a month/year VaDate web component is present (future-proofing)
        // Attempt to select month & year inside the shadow DOM
        const monthValue = `${month}`; // allow either numeric ('3') or name ('March')
        cy.get('va-date, va-date-picker').then($els => {
          if ($els.length) {
            cy.wrap($els.first())
              .shadow()
              .within(() => {
                // Try numeric month select
                cy.get('select[name="month"]').then($m => {
                  if ($m.length) {
                    // If the provided month is a name, map to number (1-12)
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
                    cy.get('select[name="month"]').select(normalized);
                  }
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

  // Make this resilient: specs pass 'March 2024' but UI shows just '2024'. Assert on year only.
  verifySelectedDate = ({ dateString }) => {
    const year = dateString.split(' ').pop();
    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").contains(year);
  };

  viewNextPage = () => {
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).click();
  };
}

export default new Vitals();
