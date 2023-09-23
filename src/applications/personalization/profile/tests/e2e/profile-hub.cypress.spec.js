import { checkForLegacyLoadingIndicator } from '~/applications/personalization/common/e2eHelpers';
import mockUser from '../fixtures/users/user-36.json';
import { PROFILE_PATHS } from '../../constants';
import { mockProfileLOA3 } from './helpers';
import { generateFeatureToggles } from '../../mocks/endpoints/feature-toggles';

describe('Profile - Hub page', () => {
  // visits the profile page with useProfileHub toggled on and off
  // and checks that the correct content is rendered

  beforeEach(() => {
    cy.login(mockUser);
    mockProfileLOA3();
  });

  it('should render the correct content with toggle ON', () => {
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    checkForLegacyLoadingIndicator();

    cy.findByText('Profile', { selector: 'h1' }).should('exist');
    cy.findByText('Personal information', { selector: 'h2' }).should('exist');
    cy.findByText('Contact information', { selector: 'h2' }).should('exist');
    cy.findByText('Military information', { selector: 'h2' }).should('exist');
    cy.findByText('Direct deposit information', { selector: 'h2' }).should(
      'exist',
    );
    cy.findByText('Notification settings', { selector: 'h2' }).should('exist');

    cy.findByText('Account security', { selector: 'h2' }).should('exist');
    cy.findByText('Connected apps', { selector: 'h2' }).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should render the correct content with toggle OFF', () => {
    cy.intercept(
      'v0/feature_toggles*',
      generateFeatureToggles({ useProfileHub: false }),
    );
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    checkForLegacyLoadingIndicator();

    // renders personal information page
    cy.findByText('Legal name').should('exist');
    cy.findByText('Date of birth').should('exist');
    cy.findByText('Preferred name').should('exist');
    cy.findByText('Gender identity').should('exist');
    cy.findByText('Disability rating').should('exist');

    cy.url().should('include', '/personal-information');

    cy.injectAxeThenAxeCheck();
  });
});
