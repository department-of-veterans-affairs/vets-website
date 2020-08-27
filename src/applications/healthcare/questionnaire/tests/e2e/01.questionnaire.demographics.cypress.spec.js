const Timeouts = require('platform/testing/e2e/timeouts.js');

import mockUser from './fixtures/users/user-x.json';

it('healthcare questionnaire -- demographics -- loads', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(mockUser);
    cy.visit('/healthcare/questionnaire/demographics');
    cy.get('.schemaform-title>h1', { timeout: Timeouts.normal }).contains(
      'Healthcare Questionnaire',
    );
    cy.get('[data-cy=fullName').contains('Calvin C Fletcher');
  });
});
