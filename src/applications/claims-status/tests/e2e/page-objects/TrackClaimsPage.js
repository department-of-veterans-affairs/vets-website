const Timeouts = require('platform/testing/e2e/timeouts.js');

/* eslint-disable class-methods-use-this */
class TrackClaimsPage {
  loadPage(claimsList, mock = null, submitForm = false) {
    if (submitForm) {
      cy.intercept('POST', `/v0/evss_claims/189685/request_decision`, {
        body: {},
      }).as('askVA');
    }
    if (mock) {
      cy.intercept('GET', `/v0/evss_claims_async/189685`, mock).as(
        'detailRequest',
      );
    }
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.login();
    cy.visit('/track-claims');
    cy.title().should(
      'eq',
      'Check your claim or appeal status | Veterans Affairs',
    );
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
  }

  verifyNoClaims() {
    cy.get('.claims-alert').should(
      'contain',
      'You do not have any submitted claims',
    );
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
        cy.url().should('contain', '/your-claims/189685/status');
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

  verifyInProgressClaim(inProgress = true) {
    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/189685/status');

    // Disabled until COVID-19 message removed
    // cy.get('.claim-completion-desc').should('contain', 'We estimated your claim would be completed by now');
    if (inProgress) {
      cy.get('va-alert').should('contain', 'because of COVID-19');
    }
  }

  verifyClaimedConditions(conditions) {
    cy.get('.claim-contentions > span').should(
      'contain',
      conditions.join(', '),
    );
  }

  verifyCompletedSteps(step) {
    cy.get(`.list-one.section-${step > 1 ? 'complete' : 'current'}`).should(
      'exist',
    );
    cy.get(`.list-two.section-${step > 2 ? 'complete' : 'current'}`).should(
      'exist',
    );
    cy.get(`.list-three.section-${step > 3 ? 'complete' : 'current'}`).should(
      'exist',
    );
    cy.get(`.list-four.section-${step > 4 ? 'complete' : 'current'}`).should(
      'exist',
    );
    cy.get(`.list-five.section-${step > 5 ? 'complete' : 'current'}`).should(
      'exist',
    );
  }

  verifyClosedClaim() {
    cy.get('li.list-one .section-header-button')
      .click()
      .then(() => {
        cy.get('li.list-one .claims-evidence', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        cy.get('.claim-older-updates').click();
        cy.get('#older-updates-1 li:nth-child(2) .claims-evidence-item').should(
          'contain',
          'Your claim is closed',
        );
        cy.get('.claim-older-updates').should('exist');
      });
    cy.get('li.list-one .claims-evidence', {
      timeout: Timeouts.slow,
    }).should('be.visible');
  }

  axeCheckClaimDetails() {
    cy.get('main button[aria-expanded="false"]')
      .each(el => {
        el.click();
      })
      .axeCheck();
  }

  verifyItemsNeedAttention(count) {
    cy.get('.usa-alert-body h2').should(
      'contain',
      `${count} ${count > 1 ? 'items' : 'item'} need your attention`,
    );
  }

  verifyNumberOfFiles(number) {
    cy.get('.va-tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.file-request-list-item').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('a.va-tab-trigger.va-tab-trigger--current').should(
      'contain',
      'Files',
    );
    cy.get('.file-request-list-item').should('have.length', number);
    cy.get('.submitted-file-list-item').should('have.length', number);
  }

  verifyClaimEvidence(claimId, claimStatus) {
    cy.get('.submit-additional-evidence va-alert').should('be.visible');
    cy.get(
      `.submitted-file-list-item:nth-child(${claimId}) .submission-status`,
    ).should('contain', `${claimStatus}`);
  }

  claimDetailsTab() {
    cy.get('.va-tabs li:nth-child(3) > a')
      .click()
      .then(() => {
        cy.get('.claim-details').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.url().should('contain', '/your-claims/189685/details');
  }

  verifyClaimDetails() {
    cy.get('a.va-tab-trigger.va-tab-trigger--current').should(
      'contain',
      'Details',
    );
    const details = [
      'Claim type',
      'What you’ve claimed',
      'Date received',
      'Your representative for VA claims',
    ];
    for (const id of [1, 2, 3, 4]) {
      cy.get(`.claim-detail-label:nth-of-type(${id})`).should(
        'contain',
        `${details[id - 1]}`,
      );
    }
  }

  askForClaimDecision() {
    cy.get('.claims-alert-status')
      .should('be.visible')
      .then(status => {
        cy.wrap(status).should('contain', 'Ask for your Claim Decision');
      });
    cy.get('.claims-alert-status a')
      .click()
      .then(() => {
        cy.get('.usa-button-secondary');
        cy.axeCheck();
      });
    cy.get('.main .usa-button-primary').click({ force: true });
    cy.url().should('contain', 'ask-va-to-decide');
    cy.get('input[type=checkbox]')
      .click()
      .then(() => {
        cy.get('.main .usa-button-primary').click();
        cy.wait('@askVA');
      });
    cy.url().should('contain', 'status');
    cy.get('.usa-alert-success').should('be.visible');
    cy.axeCheck();
  }

  submitFilesForReview() {
    cy.get('.file-request-list-item .usa-button')
      .first()
      .click()
      .then(() => {
        cy.get('.file-requirements');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('button.usa-button').should('contain', 'Submit Files for Review');
    cy.get('button.usa-button')
      .click()
      .then(() => {
        cy.get('.usa-input-error');
        cy.injectAxeThenAxeCheck();
      });

    cy.get('.usa-input-error-message').should(
      'contain',
      'Please select a file first',
    );
    // File uploads don't appear to work in Nightwatch/PhantomJS
    // TODO: switch to something that does support uploads or figure out the problem
    // The above comment lifted from the old Nightwatch test.  Cypress can test file uploads, however this would need to be written in a future effort after our conversion effort is complete.
  }
}

export default TrackClaimsPage;
/* eslint-enable class-methods-use-this */
