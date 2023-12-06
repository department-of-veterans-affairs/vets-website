import disabilityComps from '@@profile/mocks/endpoints/disability-compensations';
import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';
import user from '../../mocks/endpoints/user';

describe('Profile - Hub page', () => {
  // visits the profile page with useProfileHub toggled on and off
  // and checks that the correct content is rendered

  beforeEach(() => {
    cy.login(mockUser);
    mockProfileLOA3();
  });

  it('should render the correct content with toggle ON', () => {
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    cy.findByText('Profile', { selector: 'h1' }).should('exist');
    cy.findByText('Personal information', { selector: 'h2' }).should('exist');
    cy.findByText('Contact information', { selector: 'h2' }).should('exist');
    cy.findByText('Personal health care contacts', { selector: 'h2' }).should(
      'exist',
    );
    cy.findByText('Military information', { selector: 'h2' }).should('exist');
    cy.findByText('Direct deposit information', { selector: 'h2' }).should(
      'exist',
    );
    cy.findByText('Notification settings', { selector: 'h2' }).should('exist');
    cy.findByText('Account security', { selector: 'h2' }).should('exist');
    cy.findByText('Connected apps', { selector: 'h2' }).should('exist');

    cy.url().should('not.include', 'personal-information');

    cy.injectAxeThenAxeCheck();
  });

  it('should render the bad address indicator on the Hub, for a user with a bad address', () => {
    cy.intercept('v0/user', user.badAddress);

    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    cy.findByText('Profile', { selector: 'h1' }).should('exist');

    // heading of the bad address indicator alert
    cy.findByText('Review your mailing address').should('exist');

    // link text for the bad address indicator alert
    cy.findByText(
      'Go to your contact information to review your address',
    ).should('exist');

    cy.url().should('not.include', 'personal-information');

    cy.injectAxeThenAxeCheck();
  });

  it('should render blocked profile content when user is deceased', () => {
    cy.intercept(
      'v0/feature_toggles*',
      generateFeatureToggles({
        profileUseHubPage: true,
        profileLighthouseDirectDeposit: true,
      }),
    );

    cy.intercept(
      '/v0/profile/direct_deposits/disability_compensations',
      disabilityComps.isDeceased,
    );

    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    cy.findByText('We can’t show your information').should('exist');

    cy.url().should('include', 'profile/account-security');

    cy.injectAxeThenAxeCheck();
  });

  it('should render the personal information page as the profile root route when toggle is OFF', () => {
    cy.intercept(
      'v0/feature_toggles*',
      generateFeatureToggles({
        profileUseHubPage: false,
      }),
    );
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // renders personal information page
    cy.findByText('Legal name').should('exist');
    cy.findByText('Date of birth').should('exist');
    cy.findByText('Preferred name').should('exist');
    cy.findByText('Gender identity').should('exist');
    cy.findByText('Disability rating').should('exist');

    cy.url().should('include', 'profile/personal-information');

    cy.injectAxeThenAxeCheck();
  });
});
