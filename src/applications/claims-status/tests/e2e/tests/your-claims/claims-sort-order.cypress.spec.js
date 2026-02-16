import userWithAppeals from '../../fixtures/mocks/user-with-appeals.json';
import { createAppeal } from '../../support/fixtures/appeals';
import { createBenefitsClaimListItem } from '../../support/fixtures/benefitsClaims';
import { createStemClaim } from '../../support/fixtures/stemClaims';
import {
  mockAppealsEndpoint,
  mockClaimsEndpoint,
  mockFeatureToggles,
  mockStemEndpoint,
} from '../../support/helpers/mocks';

describe('Claims list sort order', () => {
  beforeEach(() => {
    mockFeatureToggles();
    mockStemEndpoint();
  });

  it('should display in-progress claims before closed claims', () => {
    const closedClaim = createBenefitsClaimListItem({
      status: 'COMPLETE',
    });
    const inProgressClaim = createBenefitsClaimListItem();

    // Mock closed claim first to prove sorting reorders them
    mockClaimsEndpoint([closedClaim, inProgressClaim]);
    mockAppealsEndpoint();

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    // The in-progress claim should appear first despite being mocked second
    cy.get('[data-testid="claim-card"]')
      .first()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'In Progress');

    cy.axeCheck();
  });

  it('should display in-progress appeals before closed appeals', () => {
    const closedAppeal = createAppeal({
      id: '111111111',
      active: false,
      statusType: 'complete',
      eventDate: '2024-06-01',
    });
    const inProgressAppeal = createAppeal({
      id: '222222222',
    });

    mockClaimsEndpoint();
    // Mock closed appeal first to prove sorting reorders them
    mockAppealsEndpoint([closedAppeal, inProgressAppeal]);

    cy.login(userWithAppeals);
    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('[data-testid="claim-card"]').should('have.length', 2);

    // The in-progress appeal (received Jan 1, 2025) should appear first
    cy.get('[data-testid="claim-card"]')
      .first()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'Received on January 1, 2025');

    // The closed appeal (received Jun 1, 2024) should appear second
    cy.get('[data-testid="claim-card"]')
      .last()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'Received on June 1, 2024');

    cy.axeCheck();
  });

  it('should display all in-progress items before all closed items', () => {
    const closedClaim = createBenefitsClaimListItem({
      status: 'COMPLETE',
    });
    const inProgressClaim = createBenefitsClaimListItem();
    const closedAppeal = createAppeal({
      id: '111111111',
      active: false,
      statusType: 'complete',
      eventDate: '2024-06-01',
      lastEventDate: '2024-12-01',
    });
    const inProgressAppeal = createAppeal({
      id: '222222222',
    });

    mockClaimsEndpoint([closedClaim, inProgressClaim]);
    mockAppealsEndpoint([closedAppeal, inProgressAppeal]);

    cy.login(userWithAppeals);
    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('[data-testid="claim-card"]').should('have.length', 4);

    // The last two cards should be closed items
    cy.get('[data-testid="claim-card"]')
      .eq(2)
      .should('contain.text', 'Step 5 of 5: Closed');

    cy.get('[data-testid="claim-card"]')
      .eq(3)
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'Received on June 1, 2024');

    cy.axeCheck();
  });

  it('should display STEM claims in the closed group after in-progress claims', () => {
    const inProgressClaim = createBenefitsClaimListItem();

    mockClaimsEndpoint([inProgressClaim]);
    mockAppealsEndpoint();
    mockStemEndpoint([createStemClaim({})]);

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    cy.get('[data-testid="claim-card"]').should('have.length', 2);

    // In-progress claim should appear first
    cy.get('[data-testid="claim-card"]')
      .first()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'In Progress');

    // STEM claim should appear last (always closed)
    cy.get('[data-testid="claim-card"]')
      .last()
      .findByText('Edith Nourse Rogers STEM Scholarship application');

    cy.axeCheck();
  });

  it('should sort in-progress claims by most recently updated first', () => {
    const olderClaim = createBenefitsClaimListItem({
      claimDate: '2024-06-01',
      phaseChangeDate: '2024-06-15',
    });
    const newerClaim = createBenefitsClaimListItem({
      claimDate: '2025-01-01',
      phaseChangeDate: '2025-01-15',
    });

    // Mock older claim first to prove sorting reorders them
    mockClaimsEndpoint([olderClaim, newerClaim]);
    mockAppealsEndpoint();

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    // More recently updated claim should appear first
    cy.get('[data-testid="claim-card"]')
      .first()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'Received on January 1, 2025');

    cy.get('[data-testid="claim-card"]')
      .last()
      .findByRole('heading', { level: 3 })
      .should('contain.text', 'Received on June 1, 2024');

    cy.axeCheck();
  });

  it('should display claims needing documents before other in-progress claims', () => {
    const claimWithoutDocs = createBenefitsClaimListItem({
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      phaseType: 'GATHERING_OF_EVIDENCE',
      claimDate: '2025-01-01',
      phaseChangeDate: '2025-01-15',
    });
    const claimWithDocs = createBenefitsClaimListItem({
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      phaseType: 'GATHERING_OF_EVIDENCE',
      documentsNeeded: true,
      claimDate: '2024-06-01',
      phaseChangeDate: '2024-06-15',
    });

    // Mock claim without docs first - groupClaimsByDocsNeeded should reorder
    mockClaimsEndpoint([claimWithoutDocs, claimWithDocs]);
    mockAppealsEndpoint();

    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();

    // Claim needing documents should appear first despite older phaseChangeDate
    cy.get('[data-testid="claim-card"]')
      .first()
      .findByText('We requested more information from you:');

    cy.axeCheck();
  });
});
