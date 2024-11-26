class Vitals {
  setIntercepts = ({ vitalData, useOhData = true }) => {
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply({
        retrievedDate: 1732224967218,
        lastRefreshDate: null,
        facilityExtractStatusList: [
          {
            extract: 'Allergy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ImagingStudy',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'VPR',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
          {
            extract: 'ChemistryHematology',
            lastRequested: 1732224367218,
            lastCompleted: 1732224667218,
            lastSuccessfulCompleted: 1732224667218,
          },
        ],
      });
    });
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      if (useOhData) {
        expect(req.url).to.contain('use_oh_data_path=1');
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(vitalData);
    }).as('vitals-list');
  };

  checkLandingPageLinks = () => {
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="allergies-oh-landing-page-link"]').should(
      'be.visible',
    );
  };

  goToVitalPage = () => {
    cy.get('[data-testid="vitals-landing-page-link"]')
      .should('be.visible')
      .click();
  };

  selectMonthAndYear = ({ month, year, submit = true }) => {
    cy.get('select[name="vitals-date-pickerMonth"]').select(month);
    cy.get('input[name="vitals-date-pickerYear"]').clear();
    cy.get('input[name="vitals-date-pickerYear"]').type(year);
    if (submit) {
      cy.get('[data-testid="update-time-frame-button"]').click({
        waitForAnimations: true,
      });
    }
  };

  verifySelectedDate = ({ dateString }) => {
    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").contains(dateString);
  };
}

export default new Vitals();
