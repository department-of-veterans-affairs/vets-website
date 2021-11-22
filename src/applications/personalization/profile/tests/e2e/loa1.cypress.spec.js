import { PROFILE_PATHS } from '../../constants';

import mockLOA1User from '../fixtures/users/user-loa1.json';

import {
  onlyAccountSecuritySectionIsAccessible,
  subNavOnlyContainsAccountSecurity,
} from './helpers';

context('when user is LOA1', () => {
  let getFullNameStub;
  let getPersonalInformationStub;
  let getServiceHistoryStub;

  beforeEach(() => {
    getFullNameStub = cy.stub();
    getPersonalInformationStub = cy.stub();
    getServiceHistoryStub = cy.stub();
    cy.intercept('v0/profile/full_name', () => {
      getFullNameStub();
    });
    cy.intercept('v0/profile/personal_information', () => {
      getPersonalInformationStub();
    });
    cy.intercept('v0/profile/service_history', () => {
      getServiceHistoryStub();
    });
    cy.login(mockLOA1User);
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
  });
  it('should only have access to the Account Security section and not call personal data APIs', () => {
    // should show a loading indicator
    cy.findByRole('progressbar').should('exist');
    cy.findByText(/loading your information/i).should('exist');

    // and then the loading indicator should be removed
    cy.findByRole('progressbar').should('not.exist');
    cy.findByText(/loading your information/i).should('not.exist');

    // should redirect to profile/account-security on load
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.ACCOUNT_SECURITY}`,
    );

    // APIs should not be called
    cy.should(() => {
      expect(getFullNameStub).not.to.be.called;
      expect(getPersonalInformationStub).not.to.be.called;
      expect(getServiceHistoryStub).not.to.be.called;
    });

    subNavOnlyContainsAccountSecurity();

    onlyAccountSecuritySectionIsAccessible();
  });
});
