const Timeouts = require('platform/testing/e2e/timeouts.js');

import mockUser from './fixtures/users/user-basic.json';

it('healthcare questionnaire -- demographics -- loads', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(async features => {
    // console.log({ mockUser });
    cy.login(mockUser);
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.visit('/healthcare/questionnaire/demographics');
    cy.get('.schemaform-title>h1', { timeout: Timeouts.normal }).contains(
      'Healthcare Questionnaire',
    );
    cy.get('[data-cy=fullName').contains('Calvin C Fletcher');
  });
});
