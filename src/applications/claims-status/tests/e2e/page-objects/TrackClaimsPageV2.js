/* eslint-disable cypress/unsafe-to-chain-command */
// START lighthouse_migration
import featureToggleClaimDetailV2Enabled from '../fixtures/mocks/lighthouse/feature-toggle-claim-detail-v2-enabled.json';
// END lighthouse_migration

const Timeouts = require('platform/testing/e2e/timeouts.js');

/* eslint-disable class-methods-use-this */
class TrackClaimsPageV2 {
  loadPage(claimsList, mock = null, submitForm = false) {
    if (submitForm) {
      cy.intercept('POST', `/v0/evss_claims/189685/request_decision`, {
        body: {},
      }).as('askVA');
    }

    if (mock) {
      cy.intercept('GET', `/v0/benefits_claims/189685`, mock).as(
        'detailRequest',
      );
    }

    cy.intercept(
      'GET',
      '/v0/feature_toggles?*',
      featureToggleClaimDetailV2Enabled,
    );
    cy.intercept('GET', '/v0/benefits_claims', claimsList);
    cy.login();

    cy.visit('/track-claims');
    cy.title().should(
      'eq',
      'Check your claim, decision review, or appeal status | Veterans Affairs',
    );

    if (claimsList.data.length) {
      cy.get('.claim-list-item', { timeout: Timeouts.slow }).should(
        'be.visible',
      );
    } else {
      cy.get('.claims-alert').should(
        'contain',
        'You do not have any submitted claims',
      );
    }

    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('.usa-breadcrumb__list-item').should('have.length', 2);
    cy.get('li[aria-current="page"').should('be.visible');
    cy.injectAxeThenAxeCheck();
  }

  checkBreadcrumbs() {
    cy.get('va-breadcrumbs > :nth-child(2) a[aria-current="page"]').should(
      'exist',
    );
    cy.get('va-breadcrumbs > :nth-child(2) a[aria-current="page"]').should(
      'contain',
      'Check your claims and appeals',
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
      'Check your claim, decision review, or appeal status',
    );
    cy.get('.claim-list-item-header')
      .first()
      .should('contain', `Claim for disability compensation`);
    cy.get('.card-status')
      .first()
      .should('contain', `Moved to this step October 31, 2016`);
    cy.get('.claim-list-item:first-child a.active-va-link')
      .click()
      .then(() => {
        cy.url().should('contain', '/your-claims/189685/status');
      });
  }

  verifyReadyClaim() {
    cy.get('.claim-list-item:first-child a.active-va-link')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.get('.main va-alert')
      .should('be.visible')
      .then(alertElem => {
        cy.wrap(alertElem).should('contain', 'We decided your claim on');
      });

    cy.get('.disability-benefits-timeline').should('not.exist');
  }

  verifyInProgressClaim(inProgress = true) {
    cy.get('.claim-list-item:first-child a.active-va-link')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/189685/status');

    if (inProgress) {
      cy.get('.usa-label').should('contain', 'In Progress');
    }
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

  verifyNumberOfTrackedItems(number) {
    cy.get('.tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.additional-evidence-container').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('a.tab.tab--current').should('contain', 'Files');
    cy.get('.file-request-list-item').should('have.length', number);
  }

  verifyNumberOfFiles(number) {
    cy.get('.tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.additional-evidence-container').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('a.tab.tab--current').should('contain', 'Files');
    cy.get('.documents-filed-container > ol > li').should(
      'have.length',
      number,
    );
  }

  verifyClaimEvidence(nthEvidenceSubmission, claimStatus) {
    cy.get(
      `.documents-filed-container > ol li:nth-child(${nthEvidenceSubmission}) div > .docs-filed-text`,
    ).should('contain', `${claimStatus}`);
  }

  claimDetailsTab() {
    cy.get('.tabs li:nth-child(3) > a')
      .click()
      .then(() => {
        cy.get('.claim-details').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.url().should('contain', '/your-claims/189685/details');
  }

  verifyClaimDetails() {
    cy.get('a.tab.tab--current').should('contain', 'Details');
    const details = ['Claim type', 'What you’ve claimed', 'Date received'];
    for (const id of [1, 2, 3]) {
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
        cy.get('.button-secondary');
        cy.axeCheck();
      });
    cy.get('.main .button-primary').click({ force: true });
    cy.url().should('contain', 'ask-va-to-decide');
    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true })
      .then(() => {
        cy.get('.main .button-primary').click();
        cy.wait('@askVA');
      });
    cy.url().should('contain', 'status');
    cy.get('va-alert').should('be.visible');
    cy.axeCheck();
  }

  askForClaimDecisionNoNotYet() {
    cy.get('.claims-alert-status')
      .should('be.visible')
      .then(status => {
        cy.wrap(status).should('contain', 'Ask for your Claim Decision');
      });
    cy.get('.claims-alert-status a')
      .click()
      .then(() => {
        cy.get('.button-secondary');
        cy.axeCheck();
      });
    cy.get('.main .button-primary').click({ force: true });
    cy.url().should('contain', 'ask-va-to-decide');
    cy.get('.main .button-secondary').click();
    cy.url().should('contain', 'status');
    cy.axeCheck();
  }

  submitFilesForReview() {
    cy.intercept('POST', `/v0/evss_claims/189685/documents`, {
      body: {},
    }).as('documents');
    cy.get('.usa-file-input input')
      .selectFile({
        contents: Cypress.Buffer.from('test file contents'),
        fileName: 'file-upload-test.txt',
        mimeType: 'text/plain',
        lastModified: Date.now(),
      })
      .then(() => {
        cy.get('.document-item-container va-select')
          .shadow()
          .find('select')
          .select('L029');
      });
    cy.get('.additional-evidence-container va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('va-button#submit')
      .shadow()
      .find('button')
      .click();
    cy.wait('@documents');
    cy.get('va-alert h2').should('contain', 'We have your evidence');
  }

  submitFilesShowsError() {
    cy.get('va-button#submit')
      .shadow()
      .find('button')
      .click()
      .then(() => {
        cy.get('va-file-input')
          .shadow()
          .find('.usa-error-message')
          .should('contain', 'Please select a file first');
        cy.injectAxeThenAxeCheck();
      });
  }

  verifyContentions() {
    cy.get('.claim-contentions > ul > li').should('have.length', 3);
    cy.get('.claim-contentions > ul > li:nth-child(4)').should('not.exist');
    cy.get('.show-all-button').click();
    cy.get('.claim-contentions > ul > li').should('have.length', 4);
  }

  verifyRecentActivity() {
    cy.get('.recent-activity-container').should('be.visible');
    cy.get('.recent-activity-container > h3').should(
      'contain',
      'Recent activity',
    );
    cy.get('.recent-activity-container > ol > li').should(
      'have.length.greaterThan',
      0,
    );
  }

  verifyRecentActivityPagination() {
    cy.get('.recent-activity-container').should('be.visible');
    cy.get('.recent-activity-container > h3').should(
      'contain',
      'Recent activity',
    );
    cy.get('.recent-activity-container > ol > li').should('have.length', 10);
    cy.get('va-pagination').should('be.visible');
    cy.get('va-pagination')
      .shadow()
      .get('.usa-pagination__list > li')
      .should('have.length.greaterThan', 1);
  }

  verifyPrimaryAlert() {
    cy.get('va-alert.primary-alert')
      .first()
      .should('be.visible');
    cy.get('va-alert.primary-alert')
      .first()
      .shadow()
      .get('va-alert.primary-alert:first-of-type a')
      .should('contain', 'Details');
    cy.get('va-alert.primary-alert')
      .first()
      .shadow()
      .get('va-alert.primary-alert:first-of-type a')
      .click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/5',
    );
  }

  verifyClosedClaimSecondaryAlert() {
    cy.get('va-alert[status="info"]')
      .first()
      .should('be.visible');
    cy.get('va-alert[status="info"]')
      .first()
      .shadow()
      .get('va-alert[status="info"]:first-of-type a')
      .should('contain', 'Get your claim letters');
    cy.get('va-alert[status="info"]')
      .first()
      .shadow()
      .get('va-alert[status="info"]:first-of-type a')
      .click();
    cy.url().should('contain', '/track-claims/your-claim-letters');
  }

  verifySecondaryAlert() {
    cy.get('va-alert[status="info"]')
      .first()
      .should('be.visible');
    cy.get('va-alert[status="info"]')
      .first()
      .shadow()
      .get('va-alert[status="info"] a')
      .first()
      .should('contain', 'add it here');
    cy.get('va-alert[status="info"]')
      .first()
      .shadow()
      .get('va-alert[status="info"] a')
      .first()
      .click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/51',
    );
  }

  verifyOpenClaimSecondaryAlertInRecentActivity() {
    cy.get('.recent-activity-container va-alert[status="info"]')
      .first()
      .should('be.visible');
    cy.get('.recent-activity-container va-alert[status="info"]')
      .first()
      .shadow()
      .get('.recent-activity-container va-alert[status="info"]:first-of-type a')
      .should('contain', 'add it here');
    cy.get('.recent-activity-container va-alert[status="info"]')
      .first()
      .shadow()
      .get('.recent-activity-container va-alert[status="info"]:first-of-type a')
      .first()
      .click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/51',
    );
  }

  verifyOverviewOfTheProcess() {
    cy.get('.what-were-doing-container h3').should(
      'contain',
      'What we’re doing',
    );
    cy.get('.what-were-doing-container va-card')
      .find('.active-va-link')
      .should('contain', 'Overview of the process');
    cy.get('.what-were-doing-container va-card')
      .find('.active-va-link')
      .click();
    cy.url().should('contain', '/your-claims/189685/overview');
  }

  verifyOverviewTimeline() {
    cy.get('#tabOverview').click();
    cy.url().should('contain', '/your-claims/189685/overview');
    cy.get('.claim-timeline').should('be.visible');
  }

  verifyOverviewShowPastUpdates() {
    cy.get('#tabOverview').click();
    cy.url().should('contain', '/your-claims/189685/overview');
    cy.get('.process-step.list-three')
      .find('button')
      .click();
    cy.get('#older-updates-3').should('be.visible');
  }

  navigateToFilesTab() {
    cy.get('#tabFiles').click();
    cy.url().should('contain', '/your-claims/189685/files');
  }

  verifyNeedToMailFiles() {
    cy.get('.additional-evidence-container va-additional-info')
      .shadow()
      .find('.additional-info-title')
      .should('contain', 'Need to mail your files?');
    cy.get('.additional-evidence-container va-additional-info')
      .shadow()
      .find('a')
      .click();
    cy.get('.additional-evidence-container va-additional-info').should(
      'contain',
      'Please upload your documents online here to help us process your claim quickly.',
    );
  }
}

export default TrackClaimsPageV2;
/* eslint-enable class-methods-use-this */
