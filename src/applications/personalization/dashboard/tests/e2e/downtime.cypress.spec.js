import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import { externalServices } from '@department-of-veterans-affairs/platform-monitoring';

import manifest from 'applications/personalization/dashboard/manifest.json';

describe('My VA Dashboard Downtime Notifications', () => {
  beforeEach(() => {
    cy.login(mockUser);

    // Mock API responses for feature toggles
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        type: 'feature_toggles',
        features: [
          { name: 'checkInExperienceEnabled', value: false },
          { name: 'preCheckInEnabled', value: false },
          { name: 'myVaUpdateErrorsWarnings', value: true },
        ],
      },
    });

    // Mock API responses
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/v0/appeals', appealsSuccess());
  });

  it('should display downtime messages for the appropriate services', () => {
    // Mock downtime for selected services
    const startTime = new Date(Date.now() - 60 * 1000); // Start 1 minute ago
    const endTime = new Date(Date.now() + 60 * 60 * 1000); // End in 1 hour

    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: externalServices.VBMS_APPEALS,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
        {
          id: '2',
          type: 'maintenance_windows',
          attributes: {
            externalService: externalServices.DMC_DEBTS,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
        {
          id: '3',
          type: 'maintenance_windows',
          attributes: {
            externalService: externalServices.VBS_MEDICAL_COPAYS,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });

    cy.visit(manifest.rootUrl);

    // Accessibility check
    cy.injectAxeThenAxeCheck();

    // Check for downtime messages in specific sections
    cy.get('[data-testid="dashboard-section-claims-and-appeals"]').within(
      () => {
        cy.findByRole('heading', { name: /claims and appeals/i }).should(
          'exist',
        );
        cy.get('va-alert[status="warning"]').should('be.visible');
        cy.contains('This application is down for maintenance').should('exist');
      },
    );

    cy.get('[data-testid="dashboard-section-debts"]').within(() => {
      cy.findByRole('heading', { name: /outstanding debts/i }).should('exist');
      cy.get('va-alert[status="warning"]').should('be.visible');
      cy.contains('This application is down for maintenance').should('exist');
    });
  });

  it('should display data for sections without active downtime', () => {
    // Mock future downtime
    const startTime = new Date(Date.now() + 60 * 60 * 25 * 1000); // Start 25 hours in the future
    const endTime = new Date(Date.now() + 60 * 60 * 30 * 1000); // End in 30 hours

    cy.intercept('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: externalServices.LIGHTHOUSE_BENEFITS_CLAIMS,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
        {
          id: '2',
          type: 'maintenance_windows',
          attributes: {
            externalService: externalServices.BGS_PAYMENT_HISTORY,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });

    cy.visit(manifest.rootUrl);

    // Accessibility check
    cy.injectAxeThenAxeCheck();

    // Verify no downtime message and presence of data
    cy.get('[data-testid="dashboard-section-claims-and-appeals"]').within(
      () => {
        cy.findByRole('heading', { name: /claims and appeals/i }).should(
          'exist',
        );
        cy.get('va-alert[status="warning"]').should('not.exist');
        cy.findByRole('link', {
          name: /manage all claims and appeals/i,
        }).should('exist');
      },
    );

    cy.get('[data-testid="dashboard-section-payment"]').within(() => {
      cy.findByRole('heading', { name: /benefit payments/i }).should('exist');
      cy.get('va-alert[status="warning"]').should('not.exist');
    });
  });
});
