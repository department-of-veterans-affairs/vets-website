import directDepositMocks from '@@profile/mocks/endpoints/direct-deposits';
import { loa3User72, loa1User } from '@@profile/mocks/endpoints/user';

import DirectDepositPage from './page-objects/DirectDeposit';

const directDeposit = new DirectDepositPage();

describe('Direct Deposit Consistently', () => {
  beforeEach(() => {
    directDeposit.setup();
  });

  it('should display the menu item for a standard user -- happy path', () => {
    cy.login(loa3User72);
    cy.intercept('GET', 'v0/profile/direct_deposits', directDepositMocks.base);

    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositInSubnav({ visitPage: false });
  });
  it('should hide the menu item for a LOA1 user', () => {
    cy.login(loa1User);
    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
  });

  it('should hide the menu for deceased veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isDeceased,
    );

    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
  it('should hide the menu for is not competent veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isNotCompetent,
    );

    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
  it('should hide the menu for has fiduciary veteran and display blocked alert', () => {
    cy.login(loa3User72);
    cy.intercept(
      'GET',
      'v0/profile/direct_deposits',
      directDepositMocks.isFiduciary,
    );

    directDeposit.visitPage();
    cy.injectAxeThenAxeCheck();
    directDeposit.confirmDirectDepositIsNotAvailableInNav();
    directDeposit.confirmRedirectToAccountSecurity();
    directDeposit.confirmProfileIsBlocked();
  });
});
