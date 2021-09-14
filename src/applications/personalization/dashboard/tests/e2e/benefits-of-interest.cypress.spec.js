import { makeMockUser } from '@@profile/tests/fixtures/users/user';
import dd4eduEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-enrolled.json';
import dd4eduNotEnrolled from '@@profile/tests/fixtures/dd4edu/dd4edu-not-enrolled.json';
import pendingInESR from '@@profile/tests/fixtures/enrollment-system/pending.json';
import notInESR from '@@profile/tests/fixtures/enrollment-system/not-in-esr.json';

import manifest from '~/applications/personalization/dashboard/manifest.json';

import {
  disabilityCompensationExists,
  educationBenefitExists,
  healthCareInfoExists,
  mockFeatureToggles,
} from './helpers';
import { VA_FORM_IDS } from '~/platform/forms/constants';

function sectionHeadingsExist() {
  cy.findByRole('heading', { name: /apply for VA benefits/i }).should('exist');
  cy.findByRole('heading', {
    name: /benefits you might be interested in/i,
  }).should('exist');
}

describe('The My VA Dashboard', () => {
  describe('when user is not a patient, has not applied for health care, and is not known to get education benefits', () => {
    beforeEach(() => {
      const user = makeMockUser();
      user.data.attributes.vaProfile.vaPatient = false;
      user.data.attributes.vaProfile.facilities = [];
      cy.intercept('/v0/health_care_applications/enrollment_status', notInESR);
      cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
      cy.login(user);
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show info about disability benefits, health care, and education benefits', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 3);

      healthCareInfoExists(true);
      disabilityCompensationExists(true);
      educationBenefitExists(true);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('when user is not a health care patient but has applied for health care, and is not known to get education benefits', () => {
    beforeEach(() => {
      const user = makeMockUser();
      user.data.attributes.vaProfile.vaPatient = false;
      user.data.attributes.vaProfile.facilities = [];
      cy.intercept(
        '/v0/health_care_applications/enrollment_status',
        pendingInESR,
      );
      cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
      cy.login(user);
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show info about disability benefits and education benefits, but not health care', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 2);

      healthCareInfoExists(false);
      disabilityCompensationExists(true);
      educationBenefitExists(true);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('when user is a health care patient and is not known to get education benefits', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
      cy.login(makeMockUser());
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show info about disability benefits and education benefits, but not health care', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 2);

      healthCareInfoExists(false);
      disabilityCompensationExists(true);
      educationBenefitExists(true);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('when user is a health care patient and gets direct deposit for education benefits', () => {
    beforeEach(() => {
      cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduEnrolled);
      cy.login(makeMockUser());
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show info about disability benefits benefits, but not health care or education benefits', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 1);

      healthCareInfoExists(false);
      disabilityCompensationExists(true);
      educationBenefitExists(false);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('when user is not a patient, has not applied for health care, and applied to education benefits', () => {
    beforeEach(() => {
      const user = makeMockUser();
      const now = Date.now() / 1000;
      const oneDayInSeconds = 24 * 60 * 60;
      const savedForms = [
        // This form is unknown and will be filtered out of the list of applications
        {
          form: VA_FORM_IDS.FORM_22_1990E,
          metadata: {
            version: 0,
            returnUrl: '/education-benefits',
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
      ];
      user.data.attributes.vaProfile.vaPatient = false;
      user.data.attributes.vaProfile.facilities = [];
      user.data.attributes.inProgressForms = savedForms;
      cy.intercept('/v0/health_care_applications/enrollment_status', notInESR);
      cy.intercept('/v0/profile/ch33_bank_accounts', dd4eduNotEnrolled);
      cy.login(user);
      mockFeatureToggles();
      cy.visit(manifest.rootUrl);
    });
    it('should show info about disability benefits, health care, and not education benefits', () => {
      sectionHeadingsExist();

      cy.findAllByTestId('benefit-of-interest').should('have.length', 2);

      healthCareInfoExists(true);
      disabilityCompensationExists(true);
      educationBenefitExists(false);

      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
