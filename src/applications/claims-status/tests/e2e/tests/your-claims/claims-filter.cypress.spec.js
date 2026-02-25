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

  // Unique IDs prevent React key conflicts when multiple claims/appeals are rendered
  const activeClaim = createBenefitsClaimListItem({
    id: 'claim-active-001',
    status: 'CLAIM_RECEIVED',
    claimDate: '2025-01-15',
    phaseChangeDate: '2025-01-16',
  });

  const closedClaim = createBenefitsClaimListItem({
    id: 'claim-closed-001',
    status: 'COMPLETE',
    claimDate: '2024-06-01',
    phaseChangeDate: '2024-12-01',
  });

  const activeAppeal = createAppeal({
    id: 'appeal-active-001',
    active: true,
    statusType: 'pending_soc',
    eventDate: '2025-01-01',
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
      mockClaimsEndpoint([activeClaim, closedClaim]);
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
      // All 4 items visible (no filtering available)
      cy.get('[data-testid="claim-card"]').should('have.length', 4);

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
        mockClaimsEndpoint([activeClaim, closedClaim]);
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

      it('should have All selected by default', () => {
        // All 4 items visible means All filter is active (2 claims + 2 appeals)
        cy.get('[data-testid="claim-card"]').should('have.length', 4);

        cy.axeCheck();
      });

      it('should show only active items when Active filter is clicked', () => {
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Active')
          .click();

        // Only active items should be visible (1 claim + 1 appeal)
        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        // Verify the items are actually active (in progress)
        cy.get('[data-testid="claim-card"]')
          .first()
          .should('contain.text', 'In Progress');

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

        cy.axeCheck();
      });

      it('should return to showing all items when All is clicked after filtering', () => {
        // First filter to closed
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Closed')
          .click();

        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        // Then click All
        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('All')
          .click();

        cy.get('[data-testid="claim-card"]').should('have.length', 4);

        cy.axeCheck();
      });

      it('should save filter selection to sessionStorage', () => {
        // All 4 items should be visible initially
        cy.get('[data-testid="claim-card"]').should('have.length', 4);

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

      it('should show pagination info even with fewer than 10 items', () => {
        cy.findByText('Showing 1-4 of 4 records');

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

        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        // Revisit the page
        cy.visit('/track-claims');
        cy.injectAxe();

        // Filter should still be on Closed (2 items, not 4)
        cy.get('[data-testid="claim-card"]').should('have.length', 2);

        cy.axeCheck();
      });
    });

    context('when filter has no matching results', () => {
      it('should show no results message when Active filter has no matches', () => {
        // Only provide closed items
        mockClaimsEndpoint([closedClaim]);
        mockAppealsEndpoint([closedAppeal]);

        cy.login(userWithAppeals);
        cy.visit('/track-claims');
        cy.injectAxe();

        cy.get('va-button-segmented')
          .shadow()
          .find('button')
          .contains('Active')
          .click();

        cy.findByText("We don't have any active records for you in our system");

        cy.axeCheck();
      });

      it('should show no results message when Closed filter has no matches', () => {
        // Only provide active items
        mockClaimsEndpoint([activeClaim]);
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

      // With All filter, should show 13 total (12 active + 1 closed)
      cy.findByText('Showing 1-10 of 13 records');

      // Filter to active only
      cy.get('va-button-segmented')
        .shadow()
        .find('button')
        .contains('Active')
        .click();

      cy.findByText('Showing 1-10 of 12 active records');

      cy.axeCheck();
    });
  });
});
