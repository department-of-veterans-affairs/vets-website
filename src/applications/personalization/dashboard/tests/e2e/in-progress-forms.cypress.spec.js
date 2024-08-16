import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import manifest from 'applications/personalization/dashboard/manifest.json';

describe('The My VA Dashboard', () => {
  const oneDayInSeconds = 24 * 60 * 60;
  const oneWeekInSeconds = 24 * 60 * 60 * 7;
  const oneYearInSeconds = 24 * 60 * 60 * 365;
  beforeEach(() => {
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });
  describe('when there are in-progress forms', () => {
    beforeEach(() => {
      // four forms, but one will fail the `isSIPEnabledForm()` check so only
      // three will be shown on the dashboard
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
        // This form is unknown and will be filtered out of the list of applications
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
          form: '686C-674',
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
        // this form expired so it won't be shown
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
      ];
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });
    it('should show benefit applications that were saved in progress and have not expired', () => {
      cy.findByRole('heading', { name: /benefit application drafts/i }).should(
        'exist',
      );
      cy.findAllByTestId('application-in-progress').should('have.length', 2);
      cy.findByText(/you have no benefit application drafts to show/i).should(
        'not.exist',
      );
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });

  describe('when there are no in-progress forms', () => {
    beforeEach(() => {
      // a single form that fails the `isSIPEnabledForm()` check so none will be
      // shown
      const savedForms = [];
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });
    it('should show fallback content when there are no benefit applications saved in progress', () => {
      cy.findByRole('heading', { name: /benefit application drafts/i }).should(
        'exist',
      );
      cy.findAllByTestId('application-in-progress').should('have.length', 0);
      cy.findByText(/you have no applications in progress/i).should('exist');
      cy.injectAxe();
      cy.axeCheck();
    });
    // TODO: add task to properly handle in-progress forms that have expired
  });

  describe('regression test for SiP Forms (#78504, #81525)', () => {
    beforeEach(() => {
      const now = Date.now() / 1000;
      const mockMeta = (formId = 0) => ({
        version: 0,
        returnUrl: '/#',
        savedAt: 1604951152710,
        expiresAt: now + oneYearInSeconds,
        lastUpdated: 1604951152,
        inProgressFormId: formId,
      });

      const savedForms = [
        {
          form: '26-1880',
          metadata: mockMeta(5105),
          lastUpdated: mockMeta.lastUpdated,
        },
        {
          form: '28-8832',
          metadata: mockMeta(5179),
          lastUpdated: mockMeta.lastUpdated,
        },
        {
          form: '21P-530V2',
          metadata: mockMeta(5199),
          lastUpdated: mockMeta.lastUpdated,
        },
      ];
      mockUser.data.attributes.inProgressForms = savedForms;
      cy.login(mockUser);
      cy.visit(manifest.rootUrl);
    });

    it('should show in-progress 26-1880, 28-8832 and 21P-530V2 forms', () => {
      cy.findByText(/26-1880/i).should('exist');
      cy.findByText(/28-8832/i).should('exist');
      cy.findByText(/21P-530EZ/i).should('exist');
      // make the a11y check
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
