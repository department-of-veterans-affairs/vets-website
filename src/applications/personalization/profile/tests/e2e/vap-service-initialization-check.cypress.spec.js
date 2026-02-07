/**
 * E2E test to verify that InitializeVAPServiceID is not being called multiple times
 * when navigating through profile pages.
 *
 * This test intercepts the VA Profile initialization endpoint and verifies that:
 * 1. The initialization endpoint is called exactly once per session
 * 2. Navigation between profile pages does not trigger additional initialization calls
 * 3. The component properly checks initialization status before making API calls
 */

import { PROFILE_PATHS } from '@@profile/constants';
import { mockUser } from '@@profile/tests/fixtures/users/user';
import mockPersonalInformation from '@@profile/tests/fixtures/personal-information-success.json';
import mockServiceHistory from '@@profile/tests/fixtures/service-history-success.json';
import mockFullName from '@@profile/tests/fixtures/full-name-success.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

describe('VA Profile Service Initialization - Multiple Mount Check', () => {
  let initCallCount = 0;

  beforeEach(() => {
    // Reset the call counter before each test
    initCallCount = 0;

    // Set up user authentication
    cy.login(mockUser);

    // Mock the VA Profile initialization endpoint and count calls
    cy.intercept('POST', '/v0/profile/initialize_vet360_id', req => {
      initCallCount += 1;
      req.reply({
        statusCode: 200,
        body: {
          data: {
            type: 'async_transaction_va_profile_initialize_person_transactions',
            attributes: {
              transactionId: 'mock-transaction-id-123',
              transactionStatus: 'COMPLETED_SUCCESS',
              type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
              metadata: [],
            },
          },
        },
      });
    }).as('initVAPService');

    // Mock the transaction status endpoint
    cy.intercept('GET', '/v0/profile/status/*', {
      statusCode: 200,
      body: {
        data: {
          type: 'async_transaction_va_profile_initialize_person_transactions',
          attributes: {
            transactionId: 'mock-transaction-id-123',
            transactionStatus: 'COMPLETED_SUCCESS',
            type: 'AsyncTransaction::VAProfile::InitializePersonTransaction',
            metadata: [],
          },
        },
      },
    }).as('transactionStatus');

    // Mock other required endpoints
    cy.intercept(
      'GET',
      '/v0/profile/personal_information',
      mockPersonalInformation,
    );
    cy.intercept('GET', '/v0/profile/service_history', mockServiceHistory);
    cy.intercept('GET', '/v0/profile/full_name', mockFullName);

    // Mock standard GET endpoints
    mockGETEndpoints([
      'v0/mhv_account',
      'v0/profile/direct_deposits',
      'v0/profile/communication_preferences',
    ]);

    // Mock feature toggles
    mockFeatureToggles();
  });

  it('should initialize VA Profile service only once when visiting the profile hub', () => {
    // Visit the profile hub page
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);

    // Wait for the page to load
    cy.get('va-loading-indicator').should('not.exist');

    // Verify that the initialization endpoint was called exactly once
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        1,
        'VA Profile initialization should be called exactly once',
      );
    });
  });

  it('should NOT re-initialize when navigating between profile pages', () => {
    // Visit the profile hub
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('va-loading-indicator').should('not.exist');

    // Record the initial call count
    let initialCallCount;
    cy.wrap(null).then(() => {
      initialCallCount = initCallCount;
      expect(initialCallCount).to.equal(
        1,
        'Initial VA Profile initialization should be called exactly once',
      );
    });

    // Navigate to Contact Information page
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
    cy.get('va-loading-indicator').should('not.exist');

    // Verify no additional initialization calls were made
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        initialCallCount,
        'VA Profile should NOT re-initialize when navigating to Contact Information',
      );
    });

    // Navigate to Personal Information page
    cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
    cy.get('va-loading-indicator').should('not.exist');

    // Verify still no additional initialization calls
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        initialCallCount,
        'VA Profile should NOT re-initialize when navigating to Personal Information',
      );
    });

    // Navigate to Military Information page
    cy.visit(PROFILE_PATHS.MILITARY_INFORMATION);
    cy.get('va-loading-indicator').should('not.exist');

    // Verify still no additional initialization calls
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        initialCallCount,
        'VA Profile should NOT re-initialize when navigating to Military Information',
      );
    });

    // Final verification
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        1,
        'VA Profile initialization should have been called exactly once throughout all navigation',
      );
    });
  });

  it('should NOT re-initialize when returning to the profile hub', () => {
    // Visit the profile hub
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('va-loading-indicator').should('not.exist');

    // Navigate to Contact Information
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
    cy.get('va-loading-indicator').should('not.exist');

    // Return to profile hub
    cy.visit(PROFILE_PATHS.PROFILE_ROOT);
    cy.get('va-loading-indicator').should('not.exist');

    // Verify initialization was only called once
    cy.wrap(null).then(() => {
      expect(initCallCount).to.equal(
        1,
        'VA Profile initialization should be called exactly once even when returning to hub',
      );
    });
  });

  it('should handle component remounting without re-initializing', () => {
    // Visit a profile page
    cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
    cy.get('va-loading-indicator').should('not.exist');

    const initialCallCount = initCallCount;

    // Force a page reload (simulates component remounting)
    cy.reload();
    cy.get('va-loading-indicator').should('not.exist');

    // After reload, the initialization should happen again (new session)
    // but only once in the new session
    cy.wrap(null).then(() => {
      expect(initCallCount).to.be.greaterThan(
        initialCallCount,
        'After page reload, initialization should occur for the new session',
      );
      expect(initCallCount).to.equal(
        initialCallCount + 1,
        'After page reload, initialization should occur exactly once for the new session',
      );
    });
  });
});
