import sessionStatus from '../fixtures/session/default.json';

class Vitals {
  setIntercepts = ({ vitalData }) => {
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.intercept('POST', '/my_health/v1/medical_records/session', {}).as(
      'session',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', req => {
      req.reply(sessionStatus);
    });
    cy.intercept('GET', '/my_health/v2/medical_records/vitals', req => {
      req.reply(vitalData);
    }).as('vitals-list');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/vitals?use_oh_data_path=1',
      req => {
        req.reply(vitalData);
      },
    ).as('vitals-list');
  };

  goToVitalPage = () => {
    cy.get('[data-testid="vitals-landing-page-link"]').as('vitals-link');
    cy.get('@vitals-link').should('be.visible');
    cy.get('@vitals-link').click();
    // Wait for page to load
    cy.get('h1').should('be.visible').and('be.focused');
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
      '97%',
    );

    cy.get('[data-testid="vital-blood-oxygen-level-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-oxygen-level-date-timestamp"]').contains(
      'December 17, 2024',
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
      '112/80',
    );

    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-pressure-date-timestamp"]').contains(
      'December 17, 2024',
    );

    cy.get('[data-testid="vital-blood-pressure-review-over-time"]').should(
      'be.visible',
    );
  };

  checkHeight = () => {
    cy.get('[data-testid="vital-height-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-height-measurement"]').contains(
      '5 feet, 5.0 inches',
    );

    cy.get('[data-testid="vital-height-date-timestamp"]').should('be.visible');
    cy.get('[data-testid="vital-height-date-timestamp"]').contains(
      'December 17, 2024',
    );

    cy.get('[data-testid="vital-height-review-over-time"]').should(
      'be.visible',
    );
  };

  checkWeight = () => {
    cy.get('[data-testid="vital-weight-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-weight-measurement"]').contains(
      '165.35 pounds',
    );

    cy.get('[data-testid="vital-weight-date-timestamp"]').should('be.visible');
    cy.get('[data-testid="vital-weight-date-timestamp"]').contains(
      'August 22, 2025',
    );

    cy.get('[data-testid="vital-weight-review-over-time"]').should(
      'be.visible',
    );
  };

  checkHeartRate = () => {
    cy.get('[data-testid="vital-heart-rate-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-heart-rate-measurement"]').contains(
      '80 beats per minute',
    );

    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-heart-rate-date-timestamp"]').contains(
      'January 29, 2025',
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
      '18 breaths per minute',
    );

    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').contains(
      'December 17, 2024',
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
      '113.0 °F',
    );

    cy.get('[data-testid="vital-temperature-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-temperature-date-timestamp"]').contains(
      'January 29, 2025',
    );

    cy.get('[data-testid="vital-temperature-review-over-time"]').should(
      'be.visible',
    );
  };
}

export default new Vitals();
