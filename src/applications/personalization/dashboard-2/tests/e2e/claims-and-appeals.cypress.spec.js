import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { mockUser } from '@@profile/tests/fixtures/users/user.js';
import serviceHistory from '@@profile/tests/fixtures/service-history-success.json';
import fullName from '@@profile/tests/fixtures/full-name-success.json';
import disabilityRating from '@@profile/tests/fixtures/disability-rating-success.json';
import claimsSuccess from '@@profile/tests/fixtures/claims-success';
import appealsSuccess from '@@profile/tests/fixtures/appeals-success';
import appeals404 from '@@profile/tests/fixtures/appeals-404.json';
import error500 from '@@profile/tests/fixtures/500.json';

import manifest from '~/applications/personalization/dashboard/manifest.json';

import { mockFeatureToggles } from './helpers';

describe('The My VA Dashboard Claims and Appeals section', () => {
  beforeEach(() => {
    disableFTUXModals();
    cy.login(mockUser);
    cy.intercept('/v0/profile/service_history', serviceHistory);
    cy.intercept('/v0/profile/full_name', fullName);
    cy.intercept(
      '/v0/disability_compensation_form/rating_info',
      disabilityRating,
    );
  });
  context(
    'when there is a recent appeals update and recent claims update',
    () => {
      beforeEach(() => {
        cy.intercept('/v0/evss_claims_async', claimsSuccess(1));
        cy.intercept('/v0/appeals', appealsSuccess(10));
      });
      it('should show details about the updated claim because it was updated more recently than the appeal', () => {
        mockFeatureToggles();
        cy.visit(manifest.rootUrl);

        // make sure that the Claims and Appeals section is shown
        cy.findByTestId('dashboard-section-claims-and-appeals').should('exist');
        cy.findByRole('link', { name: /claims and appeals/ }).should('exist');
        cy.findByRole('heading', { name: /dependency claim received/i }).should(
          'exist',
        );
        // the claims/appeals error is not shown
        cy.findByRole('heading', {
          name: /We can’t access any claims or appeals/i,
        }).should('not.exist');

        // make the a11y check
        cy.injectAxe();
        cy.axeCheck();
      });
    },
  );
  context(
    'when there are open claims or appeals but they have not been updated in the past 30 days',
    () => {
      beforeEach(() => {
        cy.intercept('/v0/evss_claims_async', claimsSuccess(31));
        cy.intercept('/v0/appeals', appealsSuccess(31));
      });
      it('should show a CTA but not details about the most recently updated claim or appeal ', () => {
        mockFeatureToggles();
        cy.visit(manifest.rootUrl);

        // make sure that the Claims and Appeals section and CTA is shown
        cy.findByTestId('dashboard-section-claims-and-appeals').should('exist');
        cy.findByRole('link', { name: /all your claims and appeals/ }).should(
          'exist',
        );
        cy.findByText(
          /You have no claims or appeals updates in the last 30 days/i,
        ).should('exist');

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
          name: /We can’t access any claims or appeals/i,
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
        mockFeatureToggles();
        cy.visit(manifest.rootUrl);

        // should show a loading indicator
        cy.findByRole('progressbar').should('exist');
        cy.findByText(/loading your information/i).should('exist');

        // and then the loading indicator should be removed
        cy.findByRole('progressbar').should('not.exist');
        cy.findByText(/loading your information/i).should('not.exist');

        // make sure that the Claims and Appeals section is shown
        cy.findByTestId('dashboard-section-claims-and-appeals').should('exist');
        cy.findByRole('heading', {
          name: /We can’t access any claims or appeals/i,
        }).should('exist');

        // make the a11y check
        cy.injectAxe();
        cy.axeCheck();
      });
    },
  );
  context(
    'when there is a 404 from the appeals API and all claims closed over 30 days ago',
    () => {
      beforeEach(() => {
        cy.intercept('/v0/evss_claims_async', claimsSuccess(100, false));
        cy.intercept('/v0/appeals', {
          statusCode: 404,
          body: appeals404,
        });
      });
      it('should hide the entire Claims and Appeals section', () => {
        mockFeatureToggles();
        cy.visit(manifest.rootUrl);

        // should show a loading indicator
        cy.findByRole('progressbar').should('exist');
        cy.findByText(/loading your information/i).should('exist');

        // and then the loading indicator should be removed
        cy.findByRole('progressbar').should('not.exist');
        cy.findByText(/loading your information/i).should('not.exist');

        // make sure that the Claims and Appeals section is hidden
        cy.findByTestId('dashboard-section-claims-and-appeals').should(
          'not.exist',
        );
        // and it doesn't show an error related to getting claims or appeals data
        cy.findByRole('heading', {
          name: /We can’t access any claims or appeals/i,
        }).should('not.exist');

        // make the a11y check
        cy.injectAxe();
        cy.axeCheck();
      });
    },
  );
});
