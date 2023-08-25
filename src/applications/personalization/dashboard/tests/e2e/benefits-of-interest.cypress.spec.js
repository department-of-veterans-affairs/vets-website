/**
 * [TestRail-integrated] Spec for My VA - Benefits Payments & Debt
 * @testrailinfo projectId 4
 * @testrailinfo suiteId 5
 * @testrailinfo groupId 4072
 * @testrailinfo runName MyVA-e2e-Benefits
 */
import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import notInESR from '@@profile/tests/fixtures/enrollment-system/not-in-esr.json';
import loa1User from '@@profile/tests/fixtures/users/user-loa1.json';
import manifest from '~/applications/personalization/dashboard/manifest.json';
import featureFlagNames from '~/platform/utilities/feature-toggles/featureFlagNames';

import {
  disabilityCompensationExists,
  educationBenefitExists,
  healthCareInfoExists,
} from './helpers';

function sectionHeadingsExist() {
  cy.findByRole('heading', { name: /apply for VA benefits/i }).should('exist');
  cy.findByRole('heading', {
    name: /explore va benefits and health care/i,
  }).should('exist');
}

describe('The My VA Dashboard', () => {
  beforeEach(() => {
    cy.intercept('/v0/health_care_applications/enrollment_status', notInESR);
    cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
  });

  describe('Should show benefits of interest to Loa1 User', () => {
    beforeEach(() => {
      cy.login(loa1User);
      cy.visit(manifest.rootUrl);
    });

    it('should show info about disability benefits, health care, and education benefits - C15782', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 3);

      healthCareInfoExists(true);
      disabilityCompensationExists(true);
      educationBenefitExists(true);

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Should show saved applications to Loa3 User', () => {
    beforeEach(() => {
      const user = makeMockUser();
      cy.login(user);
      cy.visit(manifest.rootUrl);
    });

    it('should show info about saved applications', () => {
      cy.findAllByTestId('dashboard-section-saved-applications').should(
        'exist',
      );

      cy.findAllByTestId('dashboard-all-benefits').should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('Should not show saved applications to Loa3 User', () => {
    beforeEach(() => {
      const user = makeMockUser();
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: featureFlagNames.myVaUseExperimental,
              value: true,
            },
          ],
        },
      });
      cy.login(user);
      cy.visit(manifest.rootUrl);
    });

    it('should not show the all benefits dropdown', () => {
      cy.findAllByTestId('dashboard-all-benefits').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
