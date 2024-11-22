import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import manifest from 'applications/personalization/dashboard/manifest.json';
import paymentHistory from '../fixtures/test-empty-payments-response.json';
import formStatusesNoError from '../fixtures/form-statuses-no-errors.json';
import formStatusesWithError from '../fixtures/form-statuses-with-errors.json';
import { copaysSuccessEmpty } from '../fixtures/test-copays-response';
import { notificationsSuccessEmpty } from '../fixtures/test-notifications-response';
import { debtsSuccessEmpty } from '../fixtures/test-debts-response';

describe('The My VA Dashboard', () => {
  const oneDayInSeconds = 24 * 60 * 60;
  const now = Date.now() / 1000;

  const savedForms = [
    {
      form: '21P-527EZ',
      metadata: {
        version: 3,
        returnUrl: '/military/reserve-national-guard',
        savedAt: 1604951152710,
        // one day from now
        expiresAt: now + oneDayInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: 5105,
      },
      lastUpdated: 1604951152,
    },
  ];

  beforeEach(() => {
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/profile/payment_history', paymentHistory);
    cy.intercept('GET', '/v0/feature_toggles*', { data: { features: [] } });
    cy.intercept('GET', '/v0/medical_copays', copaysSuccessEmpty()).as(
      'noCopaysB',
    );
    cy.intercept('/v0/onsite_notifications', notificationsSuccessEmpty()).as(
      'notifications1',
    );
    cy.intercept('/v0/debts', debtsSuccessEmpty()).as('noDebts');
  });

  describe('there are submitted forms', () => {
    beforeEach(() => {
      cy.intercept('/v0/my_va/submission_statuses', formStatusesNoError);
      mockUser.data.attributes.inProgressForms = [];
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should show benefit applications that and have a submission status', () => {
      cy.findByRole('heading', {
        name: /benefit applications and forms/i,
      }).should('exist');
      cy.findAllByTestId('submitted-application').should('have.length', 4);
      cy.findAllByTestId('missing-application-help').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
    });

    it('should show expected form status cards', () => {
      cy.findByRole('heading', {
        name: /benefit applications and forms/i,
      }).should('exist');
      cy.get('.usa-label').contains('Received', { matchCase: false });
      cy.get('.usa-label').contains('Submission in Progress', {
        matchCase: false,
      });
      cy.get('.usa-label').contains('Action Needed', { matchCase: false });
      cy.findAllByTestId('missing-application-help').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('there are both submitted and draft forms', () => {
    beforeEach(() => {
      cy.intercept('/v0/my_va/submission_statuses', formStatusesNoError);
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should render both submitted forms and draft forms', () => {
      cy.findByRole('heading', {
        name: /benefit applications and forms/i,
      }).should('exist');
      cy.findAllByTestId('submitted-application').should('have.length', 4);
      cy.findAllByTestId('application-in-progress').should('have.length', 1);
      cy.findAllByTestId('missing-application-help').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('there is an in-section error', () => {
    beforeEach(() => {
      cy.intercept('/v0/my_va/submission_statuses', formStatusesWithError);
      mockUser.data.attributes.inProgressForms = [];
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should render error alert', () => {
      cy.findByRole('heading', {
        name: /benefit applications and forms/i,
      }).should('exist');
      cy.findAllByTestId('benefit-application-error').should('have.length', 1);
      cy.findAllByTestId('submitted-application').should('have.length', 0);
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('when there are no submitted or draft forms', () => {
    beforeEach(() => {
      mockUser.data.attributes.inProgressForms = [];
      cy.intercept('/v0/my_va/submission_statuses', { data: [], errors: [] });
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should show empty state copy', () => {
      cy.findByRole('heading', {
        name: /benefit applications and forms/i,
      }).should('exist');
      cy.findAllByTestId('submitted-application').should('have.length', 0);
      cy.findAllByTestId('application-in-progress').should('have.length', 0);
      cy.findByText(
        /you have no benefit applications or forms to show/i,
      ).should('exist');
      cy.findAllByTestId('missing-application-help').should('have.length', 1);
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
