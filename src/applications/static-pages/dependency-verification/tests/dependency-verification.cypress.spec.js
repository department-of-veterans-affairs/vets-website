import { rootUrl } from 'applications/personalization/view-dependents/manifest.json';
import mockDependents from 'applications/personalization/view-dependents/tests/e2e/fixtures/mock-dependents.json';
import mockDiaries from './fixtures/diaries.json';

import { RETRIEVE_DIARIES } from '../utils';

const DEPENDENTS_ENDPOINT = 'v0/dependents_applications/show';

describe.skip('Dependency Verification', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'dependency_verification',
            value: true,
          },
          {
            name: 'va_view_dependents_access',
            value: true,
          },
        ],
      },
    });
    sessionStorage.removeItem(RETRIEVE_DIARIES);
  });

  it('should render a dependency verification modal', () => {
    cy.login();
    cy.intercept('GET', DEPENDENTS_ENDPOINT, mockDependents).as(
      'mockDependents',
    );
    cy.intercept('GET', '/v0/dependents_verifications', mockDiaries).as(
      'mockDiaries',
    );
    cy.visit(rootUrl);
    cy.findByRole('heading', {
      name: /Dependents on your VA benefits/i,
    }).should('exist');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('should display a confirmation message when diaries have been updated', () => {
    cy.login();
    cy.intercept('GET', DEPENDENTS_ENDPOINT, mockDependents).as(
      'mockDependents',
    );
    cy.intercept('GET', '/v0/dependents_verifications', mockDiaries).as(
      'mockDiaries',
    );
    cy.intercept('POST', '/v0/dependents_verifications', {
      statusCode: 200,
      body: { updateDiaries: 'true' },
    });
    cy.visit(rootUrl);
    cy.findByRole('heading', {
      name: /Please make sure your dependents are correct/i,
    }).should('exist');
    cy.injectAxe();
    cy.axeCheck();
    cy.findByRole('button', { name: /Verify this is correct/i }).click();
    cy.findByRole('heading', {
      name: /Thank you for verifying your dependents/i,
    }).should('exist');
    cy.axeCheck();
  });
  it('should display alert when diaries update has failed', () => {
    cy.login();
    cy.intercept('GET', DEPENDENTS_ENDPOINT, mockDependents).as(
      'mockDependents',
    );
    cy.intercept('GET', '/v0/dependents_verifications', mockDiaries).as(
      'mockDiaries',
    );
    cy.intercept('POST', '/v0/dependents_verifications', {
      statusCode: 500,
      body: { updateDiaries: 'true' },
    });
    cy.visit(rootUrl);
    cy.findByRole('heading', {
      name: /Dependents on your VA benefits/i,
    }).should('exist');
    cy.injectAxe();
    cy.axeCheck();
    cy.findByRole('button', { name: /Verify this is correct/i }).click();
    cy.findByRole('heading', {
      name: /We're sorry. Something went wrong on our end/i,
    }).should('exist');
    cy.axeCheck();
  });
});
