const Timeouts = require('platform/testing/e2e/timeouts.js');

class TrackClaimsPage {
  loadPage(claimsList, mock = null) {
    if (mock) {
      cy.intercept('GET', `/v0/evss_claims_async/11`, mock).as('detailRequest');
    }
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.login();
    cy.visit('/track-claims');
    cy.title().should('eq', 'Track Claims: VA.gov');
    if (claimsList.data.length) {
      cy.get('.claim-list-item-container', { timeout: Timeouts.slow }).should(
        'be.visible',
      );
    } else {
      cy.get('.claims-alert').should(
        'contain',
        'You do not have any submitted claims',
      );
    }
    cy.get('.va-nav-breadcrumbs').should('be.visible');
    cy.get('.va-nav-breadcrumbs-list').should('be.visible');
    cy.get('a[aria-current="page"').should('be.visible');
    cy.injectAxeThenAxeCheck();
  }

  checkBreadcrumbs() {
    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('exist');
    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('contain', 'Check your claims and appeals');
    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('have.css', 'pointer-events', 'none');
  }

  checkBreadcrumbsMobile() {
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.va-nav-breadcrumbs-list').should('be.visible');
    cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))').should(
      'have.css',
      'display',
      'none',
    );
    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').should(
      'contain',
      'Home',
    );
    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').should(
      'have.css',
      'display',
      'inline-block',
    );
    cy.viewport(1280, 960);
  }

  verifyNoClaims() {
    cy.get('.claims-alert').should(
      'contain',
      'You do not have any submitted claims',
    );
  }

  checkConsolidatedClaimsModal() {
    cy.get('button.claims-combined').click();
    cy.get('.claims-status-upload-header').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('.claims-status-upload-header').should(
      'contain',
      'A note about consolidated claims',
    );
    cy.get('.va-modal-close')
      .first()
      .click();
    cy.get('.claims-status.upload-header').should('not.exist');
    cy.axeCheck();
  }

  checkClaimsContent() {
    cy.get('.claims-container-title').should(
      'contain',
      'Check your claim or appeal status',
    );
    cy.get('.claim-list-item-header-v2')
      .first()
      .should('contain', `Claim for disability compensation`)
      .and('contain', 'updated on October 31, 2016');
    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.url().should('contain', '/your-claims/11/status');
      });
  }

  verifyReadyClaim() {
    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.get('.main .usa-alert')
      .should('be.visible')
      .then(alertElem => {
        cy.wrap(alertElem).should('contain', 'Your claim decision is ready');
      });

    cy.get('.disability-benefits-timeline').should('not.exist');
  }

  verifyInProgressClaim() {
    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/11/status');

    // Disabled until COVID-19 message removed
    // cy.get('.claim-completion-desc').should('contain', 'We estimated your claim would be completed by now');
    cy.get('va-alert').should('contain', 'COVID-19 has had on');
  }
}

export default TrackClaimsPage;
