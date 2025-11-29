import { mockBaseEndpoints, verifyNeedHelp } from '../../support/helpers';
import { createClaim } from '../../support/fixtures';

describe('Claim layout', () => {
  beforeEach(() => {
    mockBaseEndpoints();

    cy.login();
  });

  it('should display claim loader', () => {
    cy.intercept('GET', '/v0/benefits_claims/123456789', {
      delay: 1500,
      statusCode: 200,
      body: {
        data: createClaim(),
      },
    }).as('claimRequest');

    cy.visit('/track-claims/your-claims/123456789');

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
    cy.setupClaimTest({ claim: null });

    cy.findByRole('heading', {
      name: 'We encountered a problem',
      level: 1,
    });
    cy.findByRole('heading', {
      name: 'Claim status is unavailable',
      level: 2,
    });
    cy.findByText(
      'VA.gov is having trouble loading claims information at this time. Check back again in an hour. Note: You are still able to review appeals information.',
    );

    cy.axeCheck();
  });

  it('should display claim', () => {
    cy.setupClaimTest({ claim: createClaim() });

    cy.findByRole('heading', {
      name: 'Claim for compensation Received on January 1, 2025',
      level: 1,
    });

    cy.axeCheck();
  });

  it("should display what you've claimed", () => {
    cy.setupClaimTest({ claim: createClaim() });

    cy.findByRole('heading', {
      name: 'What you’ve claimed',
      level: 2,
    });

    cy.findByText('Tinnitus');
    cy.findByText('Hearing Loss');

    cy.axeCheck();
  });

  it('should display alert when no contentions are found', () => {
    cy.setupClaimTest({ claim: createClaim({ contentions: null }) });

    cy.findByText(
      "We can't show all of the details of your claim. Please check back later.",
    );

    cy.axeCheck();
  });

  it('should display tabs', () => {
    cy.setupClaimTest({ claim: createClaim() });

    cy.findByRole('link', {
      name: 'Status',
      current: 'page',
    }).should(
      'have.attr',
      'href',
      '/track-claims/your-claims/123456789/status',
    );
    cy.findByRole('link', {
      name: 'Files',
    }).should('have.attr', 'href', '/track-claims/your-claims/123456789/files');
    cy.findByRole('link', {
      name: 'Overview',
    }).should(
      'have.attr',
      'href',
      '/track-claims/your-claims/123456789/overview',
    );

    cy.axeCheck();
  });

  it('should display the need help section', () => {
    cy.setupClaimTest({ claim: createClaim() });

    verifyNeedHelp();

    cy.axeCheck();
  });
});
