import manifest from '../../manifest.json';

describe('Terms of Use', () => {
  it('displays sign in link for unauthenticated users', () => {
    cy.intercept('GET', '/v0/terms_of_use_agreements/v1/latest', {
      statusCode: 401,
      body: {
        errors: [
          {
            title: 'Not authorized',
            code: 401,
          },
        ],
      },
    }).as('latestTerms');
    cy.visit(manifest.rootUrl);

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /VA online services terms of use/i,
    }).should('exist');
    cy.findByRole('link', { name: /Sign in to VA.gov/i }).should('exist');
    cy.get('va-button[data-testid="accept"]').should('not.exist');
    cy.get('va-button[data-testid="decline"]').should('not.exist');
  });

  it('allows an authenticated user to accept the terms', () => {
    cy.login();
    cy.intercept('GET', '/v0/terms_of_use_agreements/v1/latest', {
      statusCode: 200,
      body: {},
    }).as('latestTerms');
    cy.intercept('POST', '/v0/terms_of_use_agreements/v1/accept*', {
      statusCode: 200,
      body: {
        termsOfUseAgreement: {
          response: 'accepted',
        },
      },
    }).as('acceptTerms');

    cy.visit(manifest.rootUrl);

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /VA online services terms of use/i,
    }).should('exist');

    cy.get('va-button[data-testid="accept"]').should('exist');
    cy.get('va-button[data-testid="decline"]').should('exist');
    cy.get('va-button[data-testid="accept"]').click();
    cy.wait('@acceptTerms');
  });

  it('allows an authenticated user to decline the terms via modal', () => {
    cy.login();
    cy.intercept('GET', '/v0/terms_of_use_agreements/v1/latest', {
      statusCode: 200,
      body: {},
    }).as('latestTerms');
    cy.intercept('POST', '/v0/terms_of_use_agreements/v1/decline*', {
      statusCode: 200,
      body: {
        termsOfUseAgreement: {
          response: 'declined',
        },
      },
    }).as('declineTerms');

    cy.visit(manifest.rootUrl);

    cy.injectAxe();
    cy.axeCheck();

    cy.findByRole('heading', {
      level: 1,
      name: /VA online services terms of use/i,
    }).should('exist');

    cy.get('va-button[data-testid="accept"]').should('exist');
    cy.get('va-button[data-testid="decline"]').should('exist');
    cy.get('va-button[data-testid="decline"]').click();

    cy.get('va-modal[visible]').should('exist');
    cy.contains('Decline the terms of use and sign out?').should('be.visible');

    cy.get('va-button[text="Decline and sign out"]').click();
    cy.wait('@declineTerms');
  });
});
