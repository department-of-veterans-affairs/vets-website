import userWithAppeals from '../../fixtures/mocks/user-with-appeals.json';
import { createAppeal } from '../../support/fixtures/appeals';
import { createBenefitsClaimListItem } from '../../support/fixtures/benefitsClaims';
import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('Feature flag: cstClaimsListFilter', () => {
  beforeEach(() => {
    mockStemEndpoint();
  });

  // Asymmetric test data: 3 active + 2 closed = 5 total
  // All filter counts are distinguishable: In progress=3, Closed=2, All=5
  // Includes both claim and appeal types in each category
  const activeClaim1 = createBenefitsClaimListItem({
    id: 'claim-active-001',
    status: 'CLAIM_RECEIVED',
    claimDate: '2025-01-15',
    phaseChangeDate: '2025-01-16',
  });

  const activeClaim2 = createBenefitsClaimListItem({
    id: 'claim-active-002',
    status: 'INITIAL_REVIEW',
    claimDate: '2025-01-10',
    phaseChangeDate: '2025-01-11',
  });

  const activeAppeal = createAppeal({
    id: 'appeal-active-001',
    active: true,
    statusType: 'pending_soc',
    eventDate: '2025-01-01',
  });

  const closedClaim = createBenefitsClaimListItem({
    id: 'claim-closed-001',
    status: 'COMPLETE',
    claimDate: '2024-06-01',
    phaseChangeDate: '2024-12-01',
  });

  const closedAppeal = createAppeal({
    id: 'appeal-closed-001',
    active: false,
    statusType: 'complete',
    eventDate: '2024-03-01',
  });

  context('when disabled', () => {
    beforeEach(() => {
      mockFeatureToggles({ cstClaimsListFilter: false });
      mockClaimsEndpoint([activeClaim1, activeClaim2, closedClaim]);
      mockAppealsEndpoint([activeAppeal, closedAppeal]);
      cy.login(userWithAppeals);
      cy.visit('/track-claims');
      cy.injectAxe();
    });

    it('should show combined claims additional info instead of filter', () => {
      // Filter should NOT exist
      cy.get('va-button-segmented').should('not.exist');

      // Combined claims info SHOULD exist
      cy.get('va-additional-info#claims-combined').should('exist');
      cy.get('va-additional-info')
        .shadow()
        .findByRole('button', {
          name: /Find out why we sometimes combine claims/i,
        });

      cy.axeCheck();
    });

    it('should show all claims without filtering capability', () => {
      // All 5 items visible (no filtering available)
      cy.get('[data-testid="claim-card"]').should('have.length', 5);

      cy.axeCheck();
    });

    it('should not show pagination info when fewer than 10 items', () => {
      cy.get('#pagination-info').should('not.exist');

      cy.axeCheck();
    });

    it('should display single paragraph in "What if" section without subsections', () => {
      cy.findByText(
        'If you recently submitted a claim or requested a Higher Level Review or Board appeal, we might still be processing it. Check back for updates.',
      );

      // Subsection headings should NOT exist
      cy.findByRole('heading', {
        name: 'We might still be processing it',
      }).should('not.exist');
      cy.findByRole('heading', {
        name: 'We may have combined your claims',
      }).should('not.exist');

      cy.axeCheck();
    });
  });

  context('when enabled', () => {
    beforeEach(() => {
      mockFeatureToggles({ cstClaimsListFilter: true });
    });

    describe('filter rendering and behavior', () => {
      beforeEach(() => {
        mockClaimsEndpoint([activeClaim1, activeClaim2, closedClaim]);
        mockAppealsEndpoint([activeAppeal, closedAppeal]);
        cy.login(userWithAppeals);
        cy.visit('/track-claims');
        cy.injectAxe();
      });

      it('should render filter buttons when feature flag is enabled', () => {
        cy.get('va-button-segmented').should('exist');
        cy.get('va-button-segmented').should(
          'have.attr',
          'label',
          'Claims status filter',
        );

        cy.axeCheck();
      });

      it('should hide the combined claims additional info when filter is shown', () => {
        cy.get('#claims-combined').should('not.exist');

        cy.axeCheck();
      });

      it('should have In progress selected by default', () => {
        // Only in progress items visible by default (2 claims + 1 appeal)
        cy.get('[data-testid="claim-card"]').should('have.length', 3);
        cy.get('[data-testid="claim-card"]').each(card => {
          cy.wrap(card).should('contain.text', 'In Progress');
        });

        cy.axeCheck();
      });

      it('should show only closed items when Closed filter is clicked', () => {
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        // Only closed items should be visible (1 claim + 1 appeal)
        cy.get('[data-testid="claim-card"]').should('have.length', 2);
        cy.get('[data-testid="claim-card"]').each(card => {
          cy.wrap(card).should('not.contain.text', 'In Progress');
        });

        cy.axeCheck();
      });

      it('should return to showing all items when All is clicked after filtering', () => {
        // Default is In progress (3 items)
        cy.get('[data-testid="claim-card"]').should('have.length', 3);

        // Click All to show everything
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('All')
          .click();

        cy.get('[data-testid="claim-card"]').should('have.length', 5);

        cy.axeCheck();
      });

      it('should save filter selection to sessionStorage', () => {
        // 3 in progress items visible by default
        cy.get('[data-testid="claim-card"]').should('have.length', 3);

        // Select closed filter
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        // Verify filter is applied - only 2 closed items visible
        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        // Verify sessionStorage was updated
        cy.window().then(win => {
          expect(win.sessionStorage.getItem('claimsFilter')).to.equal('closed');
        });

        cy.axeCheck();
      });

      it('should update pagination label when filter changes', () => {
        cy.findByText('Showing 1-3 of 3 in progress records');

        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        cy.findByText('Showing 1-2 of 2 closed records');

        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('All')
          .click();

        cy.findByText('Showing 1-5 of 5 records');

        cy.axeCheck();
      });

      it('should display "What if" section with two subsections', () => {
        cy.findByRole('heading', { name: 'We might still be processing it' });
        cy.findByRole('heading', {
          name: 'We may have combined your claims',
        });

        cy.findByText(
          "If you turn in a new claim while we're reviewing another one, we may combine your claims. We'll add any new information to your existing claim. You may not see a separate entry for the new claim. You don't need to do anything.",
        );

        cy.axeCheck();
      });

      it('should restore filter selection from sessionStorage on revisit', () => {
        // Select closed filter
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        // 2 closed items (not 3 in progress)
        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        // Revisit the page
        cy.visit('/track-claims');
        cy.injectAxe();

        // Filter should still be on Closed (2 items, not 3 in progress)
        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        cy.axeCheck();
      });
    });

    context('when filter has no matching results', () => {
      it('should show no results message when In progress filter has no matches', () => {
        // Only provide closed items — default "In progress" filter shows no results
        mockClaimsEndpoint([closedClaim]);
        mockAppealsEndpoint();

        cy.login(userWithAppeals);
        cy.visit('/track-claims');
        cy.injectAxe();

        // No click needed — "In progress" is the default filter
        cy.findByText(
          "We don't have any in progress records for you in our system",
        );

        cy.axeCheck();
      });

      it('should show no results message when Closed filter has no matches', () => {
        // Only provide active items
        mockClaimsEndpoint([activeClaim1]);
        mockAppealsEndpoint([activeAppeal]);

        cy.login(userWithAppeals);
        cy.visit('/track-claims');
        cy.injectAxe();

        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        cy.findByText("We don't have any closed records for you in our system");

        cy.axeCheck();
      });
    });

    it('should display correct pagination count when filter is applied', () => {
      const activeClaims = Array.from({ length: 12 }, (_, i) =>
        createBenefitsClaimListItem({
          id: `claim-active-${String(i + 1).padStart(3, '0')}`,
          status: 'CLAIM_RECEIVED',
          claimDate: `2025-01-${String(i + 1).padStart(2, '0')}`,
          phaseChangeDate: `2025-01-${String(i + 2).padStart(2, '0')}`,
        }),
      );

      mockClaimsEndpoint([...activeClaims, closedClaim]);
      mockAppealsEndpoint();

      cy.login();
      cy.visit('/track-claims');
      cy.injectAxe();

      // Default is In progress, showing 12 active claims
      cy.findByText('Showing 1-10 of 12 in progress records');

      // Switch to All filter, should show 13 total (12 active + 1 closed)
      cy.get('va-button-segmented')
        .shadow()
        .find('button')
        .contains('All')
        .click();

      cy.findByText('Showing 1-10 of 13 records');

      cy.axeCheck();
    });
  });
});
