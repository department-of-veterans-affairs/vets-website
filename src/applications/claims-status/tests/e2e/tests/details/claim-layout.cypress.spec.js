import { ENDPOINTS, mockFeatureToggles } from '../../support/helpers/mocks';
import { setupClaimTest } from '../../support/helpers/setup';
import { verifyNeedHelp } from '../../support/helpers/assertions';
import { createBenefitsClaim } from '../../support/fixtures/benefitsClaims';

const DEFAULT_CLAIM_ID = '123456789';

describe('Claim layout', () => {
  beforeEach(() => {
    mockFeatureToggles();
    cy.login();
  });

  it('should display claim loader', () => {
    cy.intercept('GET', ENDPOINTS.CLAIM_DETAIL(DEFAULT_CLAIM_ID), {
      delay: 1500,
      statusCode: 200,
      body: {
        data: createBenefitsClaim(),
      },
    }).as('claimRequest');

    cy.visit(`/track-claims/your-claims/${DEFAULT_CLAIM_ID}`);

    cy.get('va-loading-indicator').as('loadingIndicator');

    cy.get('@loadingIndicator').should(
      'have.attr',
      'message',
      'Loading your claim information...',
    );

    cy.wait('@claimRequest');

    cy.get('@loadingIndicator').should('not.exist');

    cy.findByRole('heading', {
      name: 'Claim for compensation Received on January 1, 2025',
      level: 1,
    });

    cy.injectAxe();
    cy.axeCheck();
  });

  it('should display claim unavailable alert when no claim is found', () => {
    setupClaimTest({ claim: null });

    cy.findByRole('heading', {
      name: 'We encountered a problem',
      level: 1,
    });
    cy.findByRole('heading', {
      name: "We can't access your claim right now",
      level: 2,
    });
    cy.findByText(
      "We're sorry. There's a problem with our system. Refresh this page or try again later.",
    );

    cy.axeCheck();
  });

  it('should display claim', () => {
    setupClaimTest({ claim: createBenefitsClaim() });

    cy.findByRole('heading', {
      name: 'Claim for compensation Received on January 1, 2025',
      level: 1,
    });

    cy.axeCheck();
  });

  it("should display what you've claimed", () => {
    setupClaimTest({ claim: createBenefitsClaim() });

    cy.findByRole('heading', {
      name: 'What you’ve claimed',
      level: 2,
    });

    cy.findByText('Asthma');
    cy.findByText('Emphysema');
    cy.findByText('Hearing Loss');
    cy.findByText('Sleep Apnea').should('not.exist');

    cy.get('va-button').contains('Show full list').click();

    cy.findByText('Sleep Apnea');
    cy.findByText('Tinnitus');

    cy.axeCheck();
  });

  it('should display alert when no contentions are found', () => {
    setupClaimTest({ claim: createBenefitsClaim({ contentions: null }) });

    cy.findByText(
      "We can't show all of the details of your claim. Please check back later.",
    );

    cy.axeCheck();
  });

  it('should display tabs', () => {
    setupClaimTest({ claim: createBenefitsClaim() });

    cy.findByRole('link', {
      name: 'Status',
      current: 'page',
    }).should(
      'have.attr',
      'href',
      `/track-claims/your-claims/${DEFAULT_CLAIM_ID}/status`,
    );
    cy.findByRole('link', {
      name: 'Files',
    }).should(
      'have.attr',
      'href',
      `/track-claims/your-claims/${DEFAULT_CLAIM_ID}/files`,
    );
    cy.findByRole('link', {
      name: 'Overview',
    }).should(
      'have.attr',
      'href',
      `/track-claims/your-claims/${DEFAULT_CLAIM_ID}/overview`,
    );

    cy.axeCheck();
  });

  it('should display the need help section', () => {
    setupClaimTest({ claim: createBenefitsClaim() });

    verifyNeedHelp();

    cy.axeCheck();
  });

  context('when claim is closed', () => {
    it('should display claim without In Progress label', () => {
      setupClaimTest({
        claim: createBenefitsClaim({
          status: 'COMPLETE',
          closeDate: '2025-01-15',
          latestPhaseType: 'COMPLETE',
        }),
      });

      cy.findByRole('heading', {
        name: 'Claim for compensation Received on January 1, 2025',
        level: 1,
      });

      cy.findByText('In Progress').should('not.exist');

      cy.axeCheck();
    });
  });
});
