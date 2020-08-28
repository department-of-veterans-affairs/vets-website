const Timeouts = require('platform/testing/e2e/timeouts.js');

import basicUser from './fixtures/users/user-basic.json';

describe('healthcare questionnaire -- demographics', () => {
  before(() => {
    cy.server();
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
    });
    cy.visit('/healthcare/questionnaire/demographics');
  });
  it('all default phone numbers', () => {
    cy.get('[data-testId="homePhone"]', {
      timeout: Timeouts.normal,
    }).contains('503-222-2222', {
      matchCase: false,
    });
    cy.get('[data-testId="mobilePhone"]', {
      timeout: Timeouts.normal,
    }).contains('503-555-1234', {
      matchCase: false,
    });
    cy.get('[data-testId="temporaryPhone"]', {
      timeout: Timeouts.normal,
    }).contains('503-555-5555', {
      matchCase: false,
    });
  });
  it('all default addresses', () => {
    cy.get('[data-testId="mailingAddress"]', {
      timeout: Timeouts.normal,
    }).contains('1493 Martin Luther King Rd Apt 1', {
      matchCase: false,
    });
    cy.get('[data-testId="residentialAddress"]', {
      timeout: Timeouts.normal,
    }).contains('PSC 808 Box 37', {
      matchCase: false,
    });
  });
  it('basic information', () => {
    cy.get('.schemaform-title>h1', { timeout: Timeouts.normal }).contains(
      'Healthcare Questionnaire',
    );
    cy.get('[data-testId="fullName"]', { timeout: Timeouts.normal }).contains(
      'CALVIN C FLETCHER',
      {
        matchCase: false,
      },
    );
    cy.get('[data-testId="dateOfBirth"]', {
      timeout: Timeouts.normal,
    }).contains('December 19, 1924', {
      matchCase: false,
    });
    cy.get('[data-testId="gender"]', { timeout: Timeouts.normal }).contains(
      'male',
      {
        matchCase: false,
      },
    );
  });
});
