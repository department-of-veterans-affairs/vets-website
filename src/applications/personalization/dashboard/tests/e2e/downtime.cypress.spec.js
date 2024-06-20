import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';

import manifest from 'applications/personalization/dashboard/manifest.json';
import { findVaLinkByText } from '../../../common/e2eHelpers';

/**
 *
 * @param {boolean} mobile - test on a mobile viewport or not
 *
 * This helper:
 * - loads the my VA Dashboard,
 *   checks that focus is managed correctly, and performs an aXe scan
 */
describe('The My VA Dashboard', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });

  it('should show a dismissible modal if a dependent service has downtime approaching in the next hour', () => {
    // start time is one minute from now
    const startTime = new Date(Date.now() + 60 * 1000);
    // end time is one hour from now
    const endTime = new Date(Date.now() + 60 * 60 * 1000);
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'mvi',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(manifest.rootUrl);
    cy.get('va-button', { name: /continue/i }).click();
    cy.get('va-modal')
      .invoke('attr', 'visible')
      .should('eq', 'false');

    cy.visit(manifest.rootUrl);
    cy.get('va-button', { name: /continue/i }).click();
    cy.get('va-modal')
      .invoke('attr', 'visible')
      .should('eq', 'false');
    cy.injectAxeThenAxeCheck();
  });

  it('should not show a modal if there is no upcoming downtime', () => {
    const oneDayInMS = 60 * 60 * 24 * 1000;
    // start time is one day from now
    const startTime = new Date(Date.now() + oneDayInMS);
    // end time is two days from now
    const endTime = new Date(Date.now() + oneDayInMS * 2);
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'mvi',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(manifest.rootUrl);
    cy.findByRole('heading', { name: /My VA/i }).should('exist');
    findVaLinkByText('Continue').should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should show an alert in place of Claims and Appeals data if there is active MHV service downtime', () => {
    // start time is one minute ago
    const startTime = new Date(Date.now() - 60 * 1000);
    // end time is one hour from now
    const endTime = new Date(Date.now() + 60 * 60 * 1000);
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'mhv',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(manifest.rootUrl);
    cy.findByRole('heading', { name: /We can’t access.+claims/i }).should(
      'exist',
    );
    cy.findByText(/problems with the claims or appeals tool/i).should('exist');
    cy.findByRole('link', {
      name: /manage all claims and appeals/i,
    }).should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should show an alert in place of Claims and Appeals data if there is active appeals service downtime', () => {
    // start time is one minute ago
    const startTime = new Date(Date.now() - 60 * 1000);
    // end time is one hour from now
    const endTime = new Date(Date.now() + 60 * 60 * 1000);
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'appeals',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(manifest.rootUrl);
    cy.findByRole('heading', { name: /We can’t access.+claims/i }).should(
      'exist',
    );
    cy.findByText(/problems with the claims or appeals tool/i).should('exist');
    cy.findByRole('link', {
      name: /manage all claims and appeals/i,
    }).should('not.exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should show Claims and Appeals data when there are appeals and MHV downtimes a day in the future', () => {
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
    // start time is 25 hours in the future
    const startTime = new Date(Date.now() + 60 * 60 * 25 * 1000);
    // end time is 30 days in the future
    const endTime = new Date(Date.now() + 60 * 60 * 30 * 1000);
    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'appeals',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
        {
          id: '2',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'mhv',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(manifest.rootUrl);
    cy.findByRole('heading', { name: /We can’t access.+claims/i }).should(
      'not.exist',
    );
    cy.findByText(/problems with the claims or appeals tool/i).should(
      'not.exist',
    );
    cy.findByRole('heading', {
      name: 'Claims and appeals',
    }).should('exist');
    cy.findByRole('link', {
      name: /manage all claims and appeals/i,
    }).should('exist');
    cy.injectAxeThenAxeCheck();
  });
});
