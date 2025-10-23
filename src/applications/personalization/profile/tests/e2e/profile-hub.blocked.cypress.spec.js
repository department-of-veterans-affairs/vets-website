import directDeposits from '@@profile/mocks/endpoints/direct-deposits';
import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

const checkForAccountSecurityAsRedirect = () => {
  cy.visit(PROFILE_PATHS.PROFILE_ROOT);

  cy.findByText('We can’t show your information').should('exist');

  cy.url().should('include', 'profile/account-security');
};

describe('Profile - Hub page', () => {
  beforeEach(() => {
    cy.login(mockUser);

    mockProfileLOA3(generateFeatureToggles());
  });

  it('should render blocked profile content when user is deceased', () => {
    cy.intercept('/v0/profile/direct_deposits', directDeposits.isDeceased);

    checkForAccountSecurityAsRedirect();

    cy.injectAxeThenAxeCheck();
  });

  it('should render blocked profile content when user has fiduciary flag', () => {
    cy.intercept('/v0/profile/direct_deposits', directDeposits.isFiduciary);

    checkForAccountSecurityAsRedirect();

    cy.injectAxeThenAxeCheck();
  });

  it('should render blocked profile content when user in not competent', () => {
    cy.intercept('/v0/profile/direct_deposits', directDeposits.isNotCompetent);

    checkForAccountSecurityAsRedirect();

    cy.injectAxeThenAxeCheck();
  });
});
