import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import manifest from 'applications/personalization/dashboard/manifest.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import paymentHistory from '../fixtures/test-empty-payments-response.json';
import formStatusesNoError from '../fixtures/form-statuses-no-errors.json';
import formStatusesWithError from '../fixtures/form-statuses-with-errors.json';
import { copaysSuccessEmpty } from '../fixtures/test-copays-response';
import { notificationsSuccessEmpty } from '../fixtures/test-notifications-response';
import { debtsSuccessEmpty } from '../fixtures/test-debts-response';
import MOCK_CC_APPOINTMENTS from '../../utils/mocks/appointments/MOCK_CC_APPOINTMENTS';

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
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });

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
    cy.intercept('/v0/debts?countOnly=true', debtsSuccessEmpty()).as(
      'noDebtsCount',
    );
    cy.intercept('/v0/appeals', appealsSuccess());
    cy.intercept('/v0/benefits_claims', claimsSuccess());
    cy.intercept('/vaos/v2/appointments*', MOCK_CC_APPOINTMENTS);
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
      cy.findAllByRole('heading', {
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

  describe('a submitted form is received and has a PDF download link', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            {
              name: featureFlagNames.myVaFormPdfLink,
              value: true,
            },
          ],
        },
      });
      cy.intercept('/v0/my_va/submission_statuses', formStatusesNoError);
      cy.intercept('POST', '/v0/my_va/submission_pdf_urls', {
        statusCode: 200,
        body: {
          url: 'https://example.com/form.pdf',
        },
      }).as('pdfEndpoint');

      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should show success message if download works', () => {
      cy.findAllByTestId('submitted-application').should('have.length', 4);
      cy.window().then(windowMock => {
        cy.stub(windowMock, 'open').as('windowOpen');
      });
      cy.get('button')
        .contains('Download your completed form (PDF)')
        .should('be.visible')
        .click();
      cy.wait('@pdfEndpoint')
        .its('response.statusCode')
        .should('eq', 200);
      // The file download moved to a window.open call in a
      // new window so this is how we can check it fired
      cy.get('@windowOpen').should(
        'have.been.calledWith',
        'https://example.com/form.pdf',
        '_blank',
      );
      cy.get('va-alert[status="success"]').should('be.visible');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('should show error alert if API call fails', () => {
      cy.intercept('/v0/my_va/submission_pdf_urls', {
        statusCode: 400,
        body: { error: 'bad request' },
      }).as('getPdfUrlError');
      cy.findAllByTestId('submitted-application').should('have.length', 4);
      cy.get('button')
        .contains('Download your completed form (PDF)')
        .click();
      cy.wait('@getPdfUrlError')
        .its('response.statusCode')
        .should('eq', 400);
      cy.get('va-alert[status="error"]')
        .should('be.visible')
        .and('contain', "can't download");
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
