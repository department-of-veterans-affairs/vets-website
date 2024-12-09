import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import debtsSuccess from '@@profile/tests/fixtures/debts-success';
import medicalCopaysSuccess from '@@profile/tests/fixtures/medical-copays-success';
import onsiteNotificationsSuccess from '@@profile/tests/fixtures/onsite-notifications-success';
import paymentHistorySuccess from '@@profile/tests/fixtures/payment-history-success';
import submissionStatusesSuccess from '@@profile/tests/fixtures/submission-statuses-success';
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

    // Mock necessary API endpoints
    cy.intercept('GET', '/v0/profile/service_history', serviceHistory);
    cy.intercept('GET', '/v0/profile/full_name', fullName);
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('GET', '/v0/benefits_claims', claimsSuccess);
    cy.intercept('GET', '/v0/appeals', appealsSuccess);
    cy.intercept(
      'GET',
      '/v0/my_va/submission_statuses',
      submissionStatusesSuccess,
    );
    cy.intercept('GET', '/v0/profile/payment_history', paymentHistorySuccess);
    cy.intercept('GET', '/v0/debts', debtsSuccess);
    cy.intercept('GET', '/v0/medical_copays', medicalCopaysSuccess);
    cy.intercept('GET', '/v0/onsite_notifications', onsiteNotificationsSuccess);
  });

  const mockDowntime = services => {
    const startTime = new Date(Date.now() - 60 * 1000);
    const endTime = new Date(Date.now() + 60 * 60 * 1000);

    const downtimeData = services.map((service, idx) => ({
      id: `${idx + 1}`,
      type: 'maintenance_windows',
      attributes: {
        externalService: service,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        description: '',
      },
    }));

    cy.intercept('GET', '/v0/maintenance_windows', { data: downtimeData }).as(
      'getMaintenanceWindows',
    );
  };

  const verifySection = (sectionTestId, expectedLinks, alertVisible) => {
    cy.get(`[data-testid="${sectionTestId}"]`, { timeout: 10000 }).within(
      () => {
        if (alertVisible) {
          cy.get('va-alert')
            .find('h2[slot="headline"]')
            .should('contain.text', 'This application is down for maintenance');
        } else {
          cy.get('va-alert[status="warning"]').should('not.exist');
        }

        expectedLinks.forEach(link => {
          if (link.visible) {
            cy.get(`[data-testid="${link.testId}"]`)
              .should('exist')
              .and('have.attr', 'href', link.href);
          } else {
            cy.get(`[data-testid="${link.testId}"]`).should('not.exist');
          }
        });
      },
    );
  };

  it('should handle Claims and Appeals downtime', () => {
    mockDowntime([
      externalServices.VBMS_APPEALS,
      externalServices.LIGHTHOUSE_BENEFITS_CLAIMS,
    ]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-claims-and-appeals',
      [
        {
          testId: 'file-claims-and-appeals-link',
          href: '/disability/how-to-file-claim/',
          visible: false,
        },
        {
          testId: 'manage-claims-and-appeals-link',
          href: '/claim-or-appeal-status/',
          visible: false,
        },
      ],
      true,
    );
  });

  it('should handle Outstanding Debts downtime with debt API failure only', () => {
    mockDowntime([externalServices.DMC_DEBTS]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-debts',
      [
        {
          testId: 'debt-summary-link',
          href: '/resources/va-debt-management',
          visible: true,
        },
      ],
      true,
    );
  });

  it('should handle Outstanding Debts downtime with copay API failure only', () => {
    mockDowntime([externalServices.VBS_MEDICAL_COPAYS]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-debts',
      [
        {
          testId: 'debt-summary-link',
          href: '/resources/va-debt-management',
          visible: true,
        },
      ],
      true,
    );
  });

  it('should handle Outstanding Debts downtime with both APIs failing', () => {
    mockDowntime([
      externalServices.DMC_DEBTS,
      externalServices.VBS_MEDICAL_COPAYS,
    ]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-debts',
      [
        {
          testId: 'debt-summary-link',
          href: '/resources/va-debt-management',
          visible: true,
        },
      ],
      true,
    );
  });

  it('should handle Benefit Payments downtime', () => {
    mockDowntime([externalServices.BGS_PAYMENT_HISTORY]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-payment',
      [
        {
          testId: 'view-payment-history-link',
          href: '/va-payment-history/payments/',
          visible: false,
        },
        {
          testId: 'manage-direct-deposit-link',
          href: '/profile/direct-deposit',
          visible: false,
        },
      ],
      true,
    );
  });

  it('should handle Benefit Applications downtime', () => {
    mockDowntime([externalServices.VBMS_APPEALS]);
    cy.visit(manifest.rootUrl);
    cy.wait('@getMaintenanceWindows');
    cy.injectAxeThenAxeCheck();

    verifySection(
      'dashboard-section-benefit-application-drafts',
      [
        {
          testId: 'application-draft-resume-link',
          href: '/education/apply-for-benefits-form-22-1990/resume',
          visible: false,
        },
      ],
      true,
    );
  });
});
