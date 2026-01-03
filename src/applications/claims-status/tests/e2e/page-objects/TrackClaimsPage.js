// START lighthouse_migration
import featureToggleDisabled from '../fixtures/mocks/lighthouse/feature-toggle-disabled.json';
// END lighthouse_migration

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
      cy.intercept('GET', `/v0/benefits_claims/189685`, mock).as(
        'detailRequest',
      );
    } else {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggleDisabled);
    }
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
      .should('contain', `Claim for compensation`);
    cy.get('.card-status')
      .first()
      .should('contain', `Moved to this step on October 31, 2016`);
    cy.get('.claim-list-item:first-child va-link')
      .shadow()
      .find('a')
      .click()
      .then(() => {
        cy.url().should('contain', '/your-claims/189685/status');
      });
  }

  verifyReadyClaim() {
    cy.get('.claim-list-item:first-child va-link')
      .shadow()
      .find('a')
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
        cy.wrap(alertElem).should('contain', 'We closed your claim on');
      });

    cy.get('.disability-benefits-timeline').should('not.exist');
  }

  verifyInProgressClaim(inProgress = true) {
    cy.get('.claim-list-item:first-child va-link')
      .shadow()
      .find('a')
      .click()
      .then(() => {
        cy.get('body').should('be.visible');
        // Currently does not load data after button click, React prop error, rest of test fails

        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/189685/status');

    if (inProgress) {
      cy.get('.process-step.last div').should('be.empty');
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

  verifyNumberOfFiles(number) {
    cy.get('.tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.file-request-list-item').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('a.tab.tab--current').should('contain', 'Files');
    cy.get('.submitted-file-list-item').should('have.length', number);
  }

  verifyClaimEvidence(claimId, claimStatus) {
    cy.get('.submit-additional-evidence va-alert').should('be.visible');
    cy.get(
      `.submitted-file-list-item:nth-child(${claimId}) .submission-status`,
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

  verifyPrimaryAlertforSubmitBuddyStatement() {
    cy.get('[data-testid="item-5"]').should('be.visible');
    cy.get('[data-testid="item-5"] a').should('contain', 'View Details');
    cy.get('[data-testid="item-5"] .submission-description').should(
      'contain',
      'Submit Buddy Statement(s)',
    );
    cy.get('[data-testid="item-5"] a').click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/5',
    );
  }

  verifyPrimaryAlertfor5103Notice() {
    cy.get('[data-testid="item-13"]').should('be.visible');
    cy.get('[data-testid="item-13"] a').should('contain', 'View Details');
    cy.get('[data-testid="item-13"] .submission-description').should(
      'contain',
      'Automated 5103 Notice Response',
    );
    cy.get('[data-testid="item-13"] a').click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/13',
    );
  }

  verifyDocRequestforDefaultPage(is5103Notice = false) {
    cy.get('#default-page').should('be.visible');
    cy.get('va-additional-info').should('be.visible');
    cy.get('.submit-files-button')
      .shadow()
      .find('button')
      .should('contain', 'Submit Files for Review')
      .click();
    // Check that error messages are working
    cy.get('.submit-files-button')
      .click()
      .then(() => {
        cy.get('va-file-input')
          .shadow()
          .find('#file-input-error-alert');
        cy.injectAxeThenAxeCheck();
      });
    cy.get('va-file-input')
      .shadow()
      .find('#file-input-error-alert')
      .should('contain', 'Please select a file first');
    if (is5103Notice) {
      cy.get('.due-date-header').should(
        'contain',
        'Needed from you by July 14, 2024',
      );
    } else {
      cy.get('.due-date-header').should(
        'contain',
        'Needed from you by February 4, 2022 - Due 3 years ago',
      );
    }
  }

  verifyDocRequestBreadcrumbs(is5103Notice = false) {
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('.usa-breadcrumb__list-item').should('have.length', 4);
    cy.get('.usa-breadcrumb__list > li:nth-child(1) a').should(
      'contain',
      'VA.gov home',
    );
    cy.get('.usa-breadcrumb__list > li:nth-child(2) a').should(
      'contain',
      'Check your claims and appeals',
    );
    cy.get('.usa-breadcrumb__list > li:nth-child(3) a').should(
      'contain',
      'Status of your compensation claim',
    );
    if (is5103Notice) {
      cy.get('.usa-breadcrumb__list > li:nth-child(4) a').should(
        'contain',
        '5103 Evidence Notice',
      );
    } else {
      cy.get('.usa-breadcrumb__list > li:nth-child(4) a').should(
        'contain',
        'Submit Buddy Statement(s)',
      );
    }
  }

  verifyDocRequestfor5103Notice() {
    cy.get('#default-5103-notice-page').should('be.visible');
    cy.get('va-link').should(
      'contain',
      'Find this letter in your claim letters',
    );
    cy.get('a[data-testid="upload-evidence-link"]').should(
      'contain',
      'Upload your evidence here',
    );
    cy.get('va-checkbox')
      .shadow()
      .find('label')
      .should('contain', 'I’m finished adding evidence to support my claim.');
  }

  submitEvidenceWaiver() {
    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true })
      .then(() => {
        cy.get('#submit').click();
        cy.wait('@askVA');
      });
    cy.url().should('contain', 'files');
    cy.get('va-alert h2').should('contain', 'We received your evidence waiver');
  }

  submitFilesForReview() {
    cy.intercept('POST', `/v0/evss_claims/189685/documents`, {
      body: {},
    }).as('documents');
    cy.get('#file-upload')
      .shadow()
      .find('input')
      .selectFile(
        {
          contents: Cypress.Buffer.from('test file contents'),
          fileName: 'file-upload-test.txt',
          mimeType: 'text/plain',
          lastModified: Date.now(),
        },
        { force: true },
      )
      .then(() => {
        cy.get('.document-item-container va-select')
          .shadow()
          .find('select')
          .select('L029');
      });
    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get('va-button.submit-files-button')
      .shadow()
      .find('button')
      .click();
    cy.wait('@documents');
    cy.get('va-alert h2').should('contain', 'We have your evidence');
  }
}

export default TrackClaimsPage;
/* eslint-enable class-methods-use-this */
