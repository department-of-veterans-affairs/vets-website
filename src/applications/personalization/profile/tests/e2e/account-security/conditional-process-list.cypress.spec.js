import { checkForLegacyLoadingIndicator } from '~/applications/personalization/common/e2eHelpers';

import { PROFILE_PATHS } from '../../../constants';

import userNon2Fa from '../../fixtures/users/user-non-2fa.json';
import fullName from '../../fixtures/full-name-success.json';
import personalInformation from '../../fixtures/personal-information-success-enhanced.json';
import serviceHistory from '../../fixtures/service-history-success.json';

context('when user is LOA3, verified, TOA accepted, but Non 2Fa', () => {
  beforeEach(() => {
    cy.intercept('v0/profile/full_name', fullName);
    cy.intercept('v0/profile/personal_information', personalInformation);
    cy.intercept('v0/profile/service_history', () => serviceHistory);
    cy.intercept('v0/mhv_account', {
      data: {
        id: '',
        type: 'mhv_accounts',
        attributes: {
          accountLevel: null,
          accountState: 'no_account',
          termsAndConditionsAccepted: true,
        },
      },
    });

    cy.login(userNon2Fa);
  });

  it('should show conditional process list section', () => {
    cy.visit(PROFILE_PATHS.ACCOUNT_SECURITY);

    checkForLegacyLoadingIndicator();

    // check that process list component list has rendered
    cy.get('ol.va-conditional-process-list').should('exist');

    // check content within the process list
    cy.findByText('We’ve verified your identity.');
    cy.findByRole('button', { name: 'Add 2-factor authentication' });
    cy.findByText(
      'You’ve accepted the terms and conditions for using VA.gov health tools',
    );

    cy.injectAxeThenAxeCheck();
  });
});
