import { mockUser } from '@@profile/tests/fixtures/users/user';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import appeals404 from '@@profile/tests/fixtures/appeals-404.json';
import error500 from '@@profile/tests/fixtures/500.json';
import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import manifest from '~/applications/personalization/dashboard/manifest.json';

describe('The My VA Dashboard Claims and Appeals section', () => {
  beforeEach(() => {
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });

  describe('when the feature is not hidden', () => {
    beforeEach(() => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.myVaUseLighthouseClaims,
              value: false,
            },
          ],
        },
      }).as('featuresB');
    });
    context(
      'when there is a recent appeals update and recent claims update',
      () => {
        beforeEach(() => {
          cy.intercept('/v0/evss_claims_async', claimsSuccess(1));
          cy.intercept('/v0/appeals', appealsSuccess(10));
        });
        it('should show details about the updated claim because it was updated more recently than the appeal', () => {
          cy.visit(manifest.rootUrl);

          // make sure that the Claims and Appeals section is shown
          cy.findByTestId('dashboard-section-claims-and-appeals').should(
            'exist',
          );
          cy.findByRole('link', {
            name: /manage all claims and appeals/i,
          }).should('exist');
          cy.findByRole('heading', {
            name: /dependency claim received/i,
          }).should('exist');
          // the claims/appeals error is not shown
          cy.findByRole('heading', {
            name: /We can’t access your claims or appeals/i,
          }).should('not.exist');

          // make the a11y check
          cy.injectAxe();
          cy.axeCheck();
        });
      },
    );
    context(
      'when there is a recent claim update but there is a 500 from the appeals API',
      () => {
        beforeEach(() => {
          cy.intercept('/v0/evss_claims_async', claimsSuccess());
          cy.intercept('/v0/appeals', {
            statusCode: 500,
            body: error500,
          });
        });
        it('should show an error in the Claims and Appeals section', () => {
          cy.visit(manifest.rootUrl);

          // should show a loading indicator
          cy.get('va-loading-indicator')
            .should('exist')
            .then($container => {
              cy.wrap($container)
                .shadow()
                .findByRole('progressbar')
                .should('contain', /loading your information/i);
            });

          // and then the loading indicator should be removed
          cy.get('va-loading-indicator').should('not.exist');

          // make sure that the Claims and Appeals section is shown
          cy.findByTestId('dashboard-section-claims-and-appeals').should(
            'exist',
          );
          cy.findByRole('heading', {
            name: /We can’t access your claims or appeals/i,
          }).should('exist');

          // make the a11y check
          cy.injectAxe();
          cy.axeCheck();
        });
      },
    );
    context(
      'when there is a 404 from the appeals API and all claims closed over 60 days ago',
      () => {
        beforeEach(() => {
          cy.intercept('/v0/evss_claims_async', claimsSuccess(100, false));
          cy.intercept('/v0/appeals', {
            statusCode: 404,
            body: appeals404,
          });
        });
        it('should show there are no claims or appeals to show', () => {
          cy.visit(manifest.rootUrl);

          // should show a loading indicator
          cy.get('va-loading-indicator')
            .should('exist')
            .then($container => {
              cy.wrap($container)
                .shadow()
                .findByRole('progressbar')
                .should('contain', /loading your information/i);
            });

          // and then the loading indicator should be removed
          cy.get('va-loading-indicator').should('not.exist');

          // make sure that the Claims and Appeals section is hidden
          cy.findByTestId('dashboard-section-claims-and-appeals').should(
            'exist',
          );
          cy.findByText(/You have no claims or appeals to show./i).should(
            'exist',
          );
          // and it doesn't show an error related to getting claims or appeals data
          cy.findByRole('heading', {
            name: /We can’t access your claims or appeals/i,
          }).should('not.exist');

          // make the a11y check
          cy.injectAxe();
          cy.axeCheck();
        });
      },
    );
    context(
      'when there are no open claims or appeals and no closed claims or appeals in the past 60 days',
      () => {
        beforeEach(() => {
          cy.intercept('/v0/evss_claims_async', claimsSuccess(901, false));
          cy.intercept('/v0/appeals', appealsSuccess(901, false));
        });
        it('should show there are no claims or appeals to show', () => {
          cy.visit(manifest.rootUrl);

          // make sure that the Claims and Appeals section and CTA is shown
          cy.findByTestId('dashboard-section-claims-and-appeals').should(
            'exist',
          );
          cy.findByRole('link', {
            name: /manage all claims and appeals/i,
          }).should('exist');
          cy.findByText(/You have no claims or appeals to show./i).should(
            'exist',
          );

          // claim or appeals details are not shown
          // a highlighted appeal always has "update on" in its title
          cy.findByRole('heading', { name: /updated on/i }).should('not.exist');
          // a highlighted claim always has "claim received" in its tile
          cy.findByRole('heading', { name: /claim received/i }).should(
            'not.exist',
          );
          cy.findByRole('link', { name: /view details/i }).should('not.exist');

          // the claims/appeals error is not shown
          cy.findByRole('heading', {
            name: /We can’t access your claims or appeals/i,
          }).should('not.exist');

          // make the a11y check
          cy.injectAxe();
          cy.axeCheck();
        });
      },
    );
  });
});
