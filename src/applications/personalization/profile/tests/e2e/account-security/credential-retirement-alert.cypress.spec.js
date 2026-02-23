import { PROFILE_PATHS } from '../../../constants';

import fullName from '../../fixtures/full-name-success.json';
import personalInformation from '../../fixtures/personal-information-success-enhanced.json';
import serviceHistory from '../../fixtures/service-history-success.json';
import { generateFeatureToggles } from '../../../mocks/endpoints/feature-toggles';
import {
  dsLogonUser,
  mhvUser,
  loa1User,
  loa1UserDSLogon,
  loa1UserMHV,
} from '../../../mocks/endpoints/user';
import { findVaLinkByText } from '../../../../common/e2eHelpers';

context('credential retirement alerts on account security', () => {
  beforeEach(() => {
    cy.intercept('v0/profile/full_name', fullName);
    cy.intercept('v0/profile/personal_information', personalInformation);
    cy.intercept('v0/profile/service_history', () => serviceHistory);
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        profileShowCredentialRetirementMessaging: true,
      }),
    );
  });

  it('should show credential retirement alert content for DS Logon account', () => {
    cy.login(dsLogonUser);

    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.findByText(
      `you’ll no longer be able to sign in with your DS Logon username and password`,
      { exact: false },
    );

    findVaLinkByText('Learn how to create an account').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show credential retirement alert content for MHV account', () => {
    cy.login(mhvUser);

    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.findByText(
      `you’ll no longer be able to sign in with your My HealtheVet username and password`,
      { exact: false },
    );

    findVaLinkByText('Learn how to create an account').should('exist');

    cy.injectAxeThenAxeCheck();
  });

  it('should show credential retirement alert content for LOA1 - DS Logon users', () => {
    cy.login(loa1UserDSLogon);

    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.findByText(
      `Verify your identity with Login.gov or ID.me to manage your profile information`,
      { exact: false },
    );

    cy.findByText(
      `Starting September 30, 2025, you’ll no longer be able to sign in with your DS Logon username and password.`,
      { exact: false },
    );

    cy.injectAxeThenAxeCheck();
  });

  it('should show credential retirement alert content for LOA1 - MHV users', () => {
    cy.login(loa1UserMHV);

    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.findByText(
      `Verify your identity with Login.gov or ID.me to manage your profile information`,
      { exact: false },
    );

    cy.findByText(
      `Starting January 31, 2025, you’ll no longer be able to sign in with your My HealtheVet username and password.`,
      { exact: false },
    );

    cy.injectAxeThenAxeCheck();
  });

  it('should show standard verify identity alert content for LOA1 - id.me users', () => {
    cy.login(loa1User);

    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    cy.get('va-alert-sign-in');

    cy.injectAxeThenAxeCheck();
  });
});
