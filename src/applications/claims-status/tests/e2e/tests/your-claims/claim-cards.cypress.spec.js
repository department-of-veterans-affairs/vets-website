import { mockBaseEndpoints } from '../../support/helpers';

describe('Claim cards', () => {
  const setupClaimCardsTest = (claims = []) => {
    cy.intercept('GET', '/v0/benefits_claims', { data: claims });
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  const createClaim = ({
    claimDate = '2025-01-01',
    phaseChangeDate = '2025-01-02',
    phaseType = 'CLAIM_RECEIVED',
    claimTypeBase = 'compensation claim',
    claimTypeCode,
    decisionLetterSent,
    developmentLetterSent,
    displayTitle = 'Claim for compensation',
    documentsNeeded,
    status = 'CLAIM_RECEIVED',
  }) => {
    // Commented out properties are part of the claims response but not currently used by the claim cards
    return {
      id: '123456789', // For detail page link
      // type,
      attributes: {
        // baseEndProductCode,
        claimDate, // "Received on..." text
        claimPhaseDates: {
          phaseChangeDate, // "Moved to this step on..." text
          phaseType, // For 8-phase status text
        },
        // claimType,
        claimTypeBase,
        claimTypeCode, // To determine 5 vs 8 phases
        // closeDate,
        decisionLetterSent, // "You have a decision letter ready" text
        developmentLetterSent, // "We sent you a development letter" text
        displayTitle, // "Claim for compensation" text
        documentsNeeded, // "We requested more information from you" info alert
        // endProductCode,
        // evidenceWaiverSubmitted5103,
        // lighthouseId,
        status, // For status description
      },
    };
  };

  beforeEach(() => {
    mockBaseEndpoints();

    cy.intercept('GET', '/v0/appeals', {
      data: [],
    });
    cy.intercept('GET', '/v0/education_benefits_claims/stem_claim_status', {
      data: {},
    });

    cy.login();
  });

  it('should display completed compensation claim', () => {
    setupClaimCardsTest([createClaim({ status: 'COMPLETE' })]);

    cy.findByRole('heading', {
      name: 'Claim for compensation Received on January 1, 2025',
    });

    cy.findByText('Step 5 of 5: Closed');
    cy.findByText('Moved to this step on January 2, 2025');
    cy.findByRole('link', {
      name: 'Details for claim submitted on January 1, 2025',
    }).should(
      'have.attr',
      'href',
      '/track-claims/your-claims/123456789/status',
    );

    cy.axeCheck();
  });

  it('should display in progress compensation claim', () => {
    setupClaimCardsTest([createClaim({})]);

    cy.findByRole('heading', {
      name: 'In Progress Claim for compensation Received on January 1, 2025',
    });

    cy.findByText('Step 1 of 5: Claim received');
    cy.findByText('Moved to this step on January 2, 2025');
    cy.findByRole('link', {
      name: 'Details for claim submitted on January 1, 2025',
    });

    cy.axeCheck();
  });

  describe('Claim type titles', () => {
    const claimTypes = [
      {
        displayTitle: 'Claim for expenses related to death or burial',
        claimTypeBase: 'expenses related to death or burial',
      },
      {
        displayTitle: 'Claim for disability compensation',
        claimTypeBase: 'disability compensation claim',
      },
      {
        displayTitle: 'Request to add or remove a dependent',
        claimTypeBase: 'request to add or remove a dependent',
      },
      {
        displayTitle: 'Claim for Survivors Pension',
        claimTypeBase: 'survivors pension claim',
      },
      {
        displayTitle: 'Claim for Dependency and Indemnity Compensation',
        claimTypeBase: 'dependency and indemnity compensation claim',
      },
      {
        displayTitle: 'Claim for Veterans Pension',
        claimTypeBase: 'veterans pension claim',
      },
      {
        displayTitle: 'Claim for pension',
        claimTypeBase: 'pension claim',
      },
    ];

    claimTypes.forEach(({ claimTypeBase, displayTitle }) => {
      it(`should display ${displayTitle}`, () => {
        setupClaimCardsTest([createClaim({ claimTypeBase, displayTitle })]);

        cy.findByRole('heading', {
          name: `In Progress ${displayTitle} Received on January 1, 2025`,
        });

        cy.axeCheck();
      });
    });
  });

  describe('Communication notifications', () => {
    it('should display development letter notification', () => {
      setupClaimCardsTest([
        createClaim({
          developmentLetterSent: true,
          decisionLetterSent: false,
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          phaseType: 'GATHERING_OF_EVIDENCE',
        }),
      ]);

      cy.findByText('We sent you a development letter');

      cy.axeCheck();
    });

    it('should display decision letter notification', () => {
      setupClaimCardsTest([
        createClaim({
          developmentLetterSent: false,
          decisionLetterSent: true,
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          phaseType: 'GATHERING_OF_EVIDENCE',
        }),
      ]);

      cy.findByText('You have a decision letter ready');

      cy.axeCheck();
    });
  });

  describe('Phase display', () => {
    context('when using 5-phase system', () => {
      const phases = [
        {
          status: 'CLAIM_RECEIVED',
          expected: 'Step 1 of 5: Claim received',
        },
        {
          status: 'INITIAL_REVIEW',
          expected: 'Step 2 of 5: Initial review',
        },
        {
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          expected: 'Step 3 of 5: Evidence gathering, review, and decision',
        },
        {
          status: 'PREPARATION_FOR_NOTIFICATION',
          expected: 'Step 4 of 5: Preparation for notification',
        },
        {
          status: 'COMPLETE',
          expected: 'Step 5 of 5: Closed',
        },
      ];

      phases.forEach(({ status, expected }) => {
        it(`should display ${expected}`, () => {
          setupClaimCardsTest([createClaim({ status })]);

          cy.findByText(expected);

          cy.axeCheck();
        });
      });
    });

    context('when using 8-phase system', () => {
      const phases = [
        {
          phaseType: 'CLAIM_RECEIVED',
          claimTypeCode: '020NEW',
          expected: 'Step 1 of 8: Claim received',
        },
        {
          phaseType: 'UNDER_REVIEW',
          claimTypeCode: '020NEW',
          expected: 'Step 2 of 8: Initial review',
        },
        {
          phaseType: 'GATHERING_OF_EVIDENCE',
          claimTypeCode: '020NEW',
          expected: 'Step 3 of 8: Evidence gathering',
        },
        {
          phaseType: 'REVIEW_OF_EVIDENCE',
          claimTypeCode: '020NEW',
          expected: 'Step 4 of 8: Evidence review',
        },
        {
          phaseType: 'PREPARATION_FOR_DECISION',
          claimTypeCode: '020NEW',
          expected: 'Step 5 of 8: Rating',
        },
        {
          phaseType: 'PENDING_DECISION_APPROVAL',
          claimTypeCode: '020NEW',
          expected: 'Step 6 of 8: Preparing decision letter',
        },
        {
          phaseType: 'PREPARATION_FOR_NOTIFICATION',
          claimTypeCode: '020NEW',
          expected: 'Step 7 of 8: Final review',
        },
        {
          phaseType: 'COMPLETE',
          claimTypeCode: '020NEW',
          expected: 'Step 8 of 8: Claim decided',
        },
      ];

      phases.forEach(({ phaseType, claimTypeCode, expected }) => {
        it(`should display ${expected}`, () => {
          setupClaimCardsTest([createClaim({ phaseType, claimTypeCode })]);

          cy.findByText(expected);

          cy.axeCheck();
        });
      });
    });
  });

  describe('Document alerts', () => {
    it('should display documents needed alert', () => {
      setupClaimCardsTest([
        createClaim({
          documentsNeeded: true,
          decisionLetterSent: false,
          status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          phaseType: 'GATHERING_OF_EVIDENCE',
        }),
      ]);

      cy.findByText('We requested more information from you:');

      cy.axeCheck();
    });
  });
});
