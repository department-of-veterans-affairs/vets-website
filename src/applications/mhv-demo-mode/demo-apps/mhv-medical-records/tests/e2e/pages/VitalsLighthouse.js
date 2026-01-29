import sessionStatus from '../accelerated/fixtures/session/default.json';

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
      } else {
        expect(req.url).to.not.contain('use_oh_data_path=1');
      }
      req.reply(vitalData);
    }).as('vitals-list');
  };

  goToVitalPage = () => {
    cy.get('[data-testid="vitals-landing-page-link"]').as('vitals-link');
    cy.get('@vitals-link').should('be.visible');
    cy.get('@vitals-link').click();
  };

  viewNextPage = () => {
    cy.get(
      'nav > ul > li.usa-pagination__item.usa-pagination__arrow > a',
    ).click();
  };

  checkPulseOx = () => {
    cy.get('[data-testid="vital-blood-oxygen-level-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-oxygen-level-measurement"]').contains(
      '84%',
    );

    cy.get('[data-testid="vital-blood-oxygen-level-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-oxygen-level-date-timestamp"]').contains(
      'August 8, 2013',
    );

    cy.get('[data-testid="vital-blood-oxygen-level-review-over-time"]').should(
      'be.visible',
    );
  };

  checkBloodPressure = () => {
    cy.get('[data-testid="vital-blood-pressure-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-pressure-measurement"]').contains(
      '130/81',
    );

    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').contains(
      'March 26, 2024',
    );

    cy.get('[data-testid="vital-blood-pressure-review-over-time"]').should(
      'be.visible',
    );
  };

  checkHeight = () => {
    cy.get('[data-testid="vital-height-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-height-measurement"]').contains('171.3 cm');

    cy.get('[data-testid="vital-height-date-timestamp"]').should('be.visible');
    cy.get('[data-testid="vital-height-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-height-review-over-time"]').should(
      'be.visible',
    );
  };

  checkWeight = () => {
    cy.get('[data-testid="vital-weight-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-weight-measurement"]').contains('88.6 kg');

    cy.get('[data-testid="vital-weight-date-timestamp"]').should('be.visible');
    cy.get('[data-testid="vital-weight-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-weight-review-over-time"]').should(
      'be.visible',
    );
  };

  checkHeartRate = () => {
    cy.get('[data-testid="vital-heart-rate-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-heart-rate-measurement"]').contains(
      '98 beats per minute',
    );

    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-heart-rate-review-over-time"]').should(
      'be.visible',
    );
  };

  checkRespiration = () => {
    cy.get('[data-testid="vital-breathing-rate-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-breathing-rate-measurement"]').contains(
      '13 breaths per minute',
    );

    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').contains(
      'January 18, 2017',
    );

    cy.get('[data-testid="vital-breathing-rate-review-over-time"]').should(
      'be.visible',
    );
  };

  checkTemperature = () => {
    cy.get('[data-testid="vital-temperature-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-temperature-measurement"]').contains(
      '39.134 Cel',
    );

    cy.get('[data-testid="vital-temperature-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-temperature-date-timestamp"]').contains(
      'December 29, 2004',
    );

    cy.get('[data-testid="vital-temperature-review-over-time"]').should(
      'be.visible',
    );
  };
}

export default new Vitals();
