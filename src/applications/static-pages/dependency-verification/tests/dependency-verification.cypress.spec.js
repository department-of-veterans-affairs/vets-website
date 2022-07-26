import { getAppUrl } from 'platform/utilities/registry-helpers';

import { RETRIEVE_DIARIES } from '../utils';
import mockDependents from './fixtures/mock-dependents.json';
import mockDiaries from './fixtures/diaries.json';

const DEPENDENTS_ENDPOINT = 'v0/dependents_applications/show';
const viewDependentsUrl = getAppUrl('dependents-view-dependents');

describe('Dependency Verification', () => {
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
    cy.visit(viewDependentsUrl);
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
    cy.visit(viewDependentsUrl);
    cy.findByRole('heading', {
      name: /Please make sure your dependents are correct/i,
    }).should('exist');
    cy.injectAxe();
    cy.axeCheck();
    cy.findByRole('button', { name: /This is correct/i }).click();
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
    cy.visit(viewDependentsUrl);
    cy.findByRole('heading', {
      name: /Dependents on your VA benefits/i,
    }).should('exist');
    cy.injectAxe();
    cy.axeCheck();
    cy.findByRole('button', { name: /This is correct/i }).click();
    cy.findByRole('heading', {
      name: /We’re sorry. Something went wrong on our end/i,
    }).should('exist');
    cy.axeCheck();
  });
});
