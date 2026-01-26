import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import manifest from 'applications/personalization/dashboard/manifest.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';
import paymentHistory from '../fixtures/test-empty-payments-response.json';
import formStatusesNoError from '../fixtures/form-statuses-no-errors.json';
import formStatusesWithError from '../fixtures/form-statuses-with-errors.json';

// New E2E spec for the next version of the Forms and Applications section

describe('My VA Dashboard — Forms and applications', () => {
  const oneDayInSeconds = 24 * 60 * 60;
  const oneWeekInSeconds = 24 * 60 * 60 * 7;
  const oneYearInSeconds = 24 * 60 * 60 * 365;
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
    // Unknown form filtered out of in-progress list
    {
      form: '28-1800',
      metadata: {
        version: 0,
        returnUrl: '/communication-preferences',
        savedAt: 1611946775267,
        submission: {
          status: false,
          errorMessage: false,
          id: false,
          timestamp: false,
          hasAttemptedSubmit: false,
        },
        expiresAt: now + oneDayInSeconds,
        lastUpdated: 1611946775,
        inProgressFormId: 9332,
      },
      lastUpdated: 1611946775,
    },
    {
      form: '686C-674-V2',
      metadata: {
        version: 1,
        returnUrl: '/net-worth',
        savedAt: 1607012813063,
        submission: {
          status: false,
          errorMessage: false,
          id: false,
          timestamp: false,
          hasAttemptedSubmit: false,
        },
        // one year from now
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1607012813,
        inProgressFormId: 5179,
      },
      lastUpdated: 1607012813,
    },
    // expired form not shown
    {
      form: '21-526EZ',
      metadata: {
        version: 6,
        returnUrl: '/review-veteran-details/separation-location',
        savedAt: 1612535290474,
        submission: {
          status: false,
          errorMessage: false,
          id: false,
          timestamp: false,
          hasAttemptedSubmit: false,
        },
        // expired one week ago
        expiresAt: now - oneWeekInSeconds,
        lastUpdated: 1612535290,
        inProgressFormId: 9374,
      },
      lastUpdated: 1612535290,
    },
    // additional regression forms that should appear
    {
      form: '26-1880',
      metadata: {
        version: 0,
        returnUrl: '/#',
        savedAt: 1604951152710,
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: 5105,
      },
      lastUpdated: 1604951152,
    },
    {
      form: '28-8832',
      metadata: {
        version: 0,
        returnUrl: '/#',
        savedAt: 1604951152710,
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: 5179,
      },
      lastUpdated: 1604951152,
    },
    {
      form: '21P-530EZ',
      metadata: {
        version: 0,
        returnUrl: '/#',
        savedAt: 1604951152710,
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: 5199,
      },
      lastUpdated: 1604951152,
    },
    {
      form: '1010ez',
      metadata: {
        version: 0,
        returnUrl: '/#',
        savedAt: 1604951152710,
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: 5200,
      },
      lastUpdated: 1604951152,
    },
  ];

  const verifySectionHeader = () => {
    cy.findByRole('heading', {
      name: 'Forms and applications',
      level: 2,
    }).should('exist');
  };

  beforeEach(() => {
    // Enable the dashboard redesign and all features for it under the Forms and applications section
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: featureFlagNames.myVaAuthExpRedesignEnabled,
            value: true,
          },
          {
            name: featureFlagNames.myVaFormPdfLink,
            value: true,
          },
        ],
      },
    });

    // Blank intercepts for stuff in other sections we don't care about
    cy.intercept('/data/cms/vamc-ehr.json', { data: [] });
    cy.intercept('/v0/appeals', { data: [] });
    cy.intercept('/v0/benefits_claims', { data: [] });
    cy.intercept('/v0/debts*', { data: [] });
    cy.intercept('/v0/medical_copays', { data: [] });
    cy.intercept('/v0/my_va/submission_statuses', { data: [] });
    cy.intercept('/v0/onsite_notifications', { data: [] });
    cy.intercept('/vaos/v2/appointments*', { data: [] });
    // Fill in some others to pass through required requests
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
    cy.intercept('/v0/profile/payment_history', paymentHistory);
  });

  describe('there are both in-progress and completed forms', () => {
    beforeEach(() => {
      cy.intercept('/v0/my_va/submission_statuses', formStatusesNoError);
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('renders both submitted and in-progress forms on success', () => {
      verifySectionHeader();

      // No error message
      cy.findByTestId('benefit-application-error').should('not.exist');
      // No empty messages
      cy.findByTestId('applications-in-progress-empty-state').should(
        'not.exist',
      );
      cy.findByTestId('applications-completed-empty-state').should('not.exist');

      // In-progress subsection
      cy.findByRole('heading', { name: /In-progress forms/i }).should('exist');
      cy.findAllByTestId('application-in-progress').should('have.length', 6);

      // Completed forms subsection
      // The regular heading is not a good match in this case because the accordion heading is used by AT
      // cy.findByRole('heading', { name: /Completed forms/i }).should('exist');
      cy.get('va-accordion-item#completed-forms-accordion-item').should(
        'have.attr',
        'header',
        'Completed forms',
      );

      // Completed forms list within accordion are initially invisible
      cy.findAllByTestId('submitted-application')
        .as('submittedApplications')
        .should('have.length', 4)
        .and('not.be.visible');

      // Expand the accordion
      cy.get('va-accordion-item#completed-forms-accordion-item')
        .should('exist')
        .shadow()
        .find('button')
        .click();

      cy.get('@submittedApplications').should('be.visible');

      // Missing application help
      cy.findByTestId('missing-application-help-additional-info').should(
        'be.visible',
      );

      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('there is a section error when the api is down', () => {
    beforeEach(() => {
      cy.intercept('/v0/my_va/submission_statuses', formStatusesWithError);
      mockUser.data.attributes.inProgressForms = [];
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('renders the error alert and no submitted cards', () => {
      verifySectionHeader();

      // Error alert
      cy.findByTestId('benefit-application-error-redesign').should('exist');

      // No card lists
      cy.findByTestId('applications-in-progress-list').should('not.exist');
      cy.findByTestId('applications-completed-list').should('not.exist');
      // No empty texts
      cy.findByTestId('applications-in-progress-empty-state').should(
        'not.exist',
      );
      cy.findByTestId('applications-completed-empty-state').should('not.exist');

      cy.findByTestId('missing-application-help-additional-info').should(
        'not.exist',
      );

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

    it('shows empty-state copy for both sections', () => {
      verifySectionHeader();

      // Check that the normal heading role for completed forms is used for the empty state
      cy.findByRole('heading', { name: /Completed forms/i }).should('exist');

      // Empty text
      cy.findByTestId('applications-in-progress-empty-state').should('exist');
      cy.findByTestId('applications-completed-empty-state').should('exist');

      // No card lists
      cy.findByTestId('applications-in-progress-list').should('not.exist');
      cy.findByTestId('applications-completed-list').should('not.exist');

      // No error alert
      cy.findByTestId('benefit-application-error-redesign').should('not.exist');

      cy.findByTestId('missing-application-help-additional-info').should(
        'exist',
      );

      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('a submitted form is received and has a PDF download link', () => {
    beforeEach(() => {
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

    it('shows a success alert when the download works', () => {
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
      cy.get('@windowOpen').should(
        'have.been.calledWith',
        'https://example.com/form.pdf',
        '_blank',
      );
      cy.get('va-alert[status="success"]').should('be.visible');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('shows an error alert when the API call fails', () => {
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
