/* eslint-disable cypress/unsafe-to-chain-command */
// START lighthouse_migration
import featureToggleClaimDetailV2Enabled from '../fixtures/mocks/lighthouse/feature-toggle-claim-detail-v2-enabled.json';
import featureToggleClaimPhasesEnabled from '../fixtures/mocks/lighthouse/feature-toggle-claim-phases-enabled.json';
import featureToggle5103UpdateEnabled from '../fixtures/mocks/lighthouse/feature-toggle-5103-update-enabled.json';
import featureToggle5103UpdateEnabledV2 from '../fixtures/mocks/lighthouse/feature-toggle-5103-update-enabled-v2.json';
import featureToggleFriendlyEvidenceRequests from '../fixtures/mocks/lighthouse/feature-toggle-cst-friendly-evidence-requests.json';
// END lighthouse_migration

const Timeouts = require('platform/testing/e2e/timeouts.js');

/* eslint-disable class-methods-use-this */
class TrackClaimsPageV2 {
  loadPage(
    claimsList,
    mock = null,
    submitForm = false,
    cstClaimPhasesToggleEnabled = false,
    cst5103UpdateEnabled = false,
    cst5103UpdateEnabledV2 = false,
    cstFriendlyEvidenceRequest = false,
  ) {
    if (submitForm) {
      cy.intercept('POST', `/v0/benefits_claims/189685/submit5103`, {
        body: {},
      }).as('askVA');
    }

    if (mock) {
      cy.intercept('GET', `/v0/benefits_claims/189685`, mock).as(
        'detailRequest',
      );
    }

    if (cstClaimPhasesToggleEnabled) {
      // When cst_use_claim_details_v2 and cst_claim_phases are enabled
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggleClaimPhasesEnabled,
      );
    } else if (cst5103UpdateEnabled) {
      // When cst_use_claim_details_v2 is disabled, cst_5103_update_enabled is enabled
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggle5103UpdateEnabled,
      );
    } else if (cst5103UpdateEnabledV2) {
      // When cst_use_claim_details_v2 and cst_5103_update_enabled are enabled
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggle5103UpdateEnabledV2,
      );
    } else if (cstFriendlyEvidenceRequest) {
      // When cst_use_claim_details_v2 and cst_friendly_evidence_requests are enabled
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggleFriendlyEvidenceRequests,
      );
    } else {
      cy.intercept(
        'GET',
        '/v0/feature_toggles?*',
        featureToggleClaimDetailV2Enabled,
      );
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
        cy.wrap(alertElem).should('contain', 'We closed your claim on');
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
    cy.intercept('POST', `/v0/benefits_claims/189685/benefits_documents`, {
      body: {},
    }).as('documents');

    // Upload file to va-file-input-multiple
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test file contents'),
        fileName: 'file-upload-test.txt',
        mimeType: 'text/plain',
      });

    // Wait for file processing and select document type
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .find('va-select')
      .should('be.visible')
      .shadow()
      .find('select')
      .should('not.be.disabled')
      .should('be.visible')
      .select('L029');

    // Click submit button
    cy.get('va-button[text="Submit documents for review"]')
      .shadow()
      .find('button')
      .click();

    cy.wait('@documents');
    cy.get('va-alert h2').should('contain', 'We received your file upload');
  }

  submitFilesShowsError() {
    // Click submit without selecting any files to trigger validation error
    cy.get('va-button[text="Submit documents for review"]')
      .shadow()
      .find('button')
      .click();

    // Check for error message in va-file-input-multiple
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('#file-input-error-alert')
      .should('be.visible')
      .and('contain.text', 'Please select a file first');

    cy.injectAxeThenAxeCheck();
  }

  verifyContentions() {
    cy.get('.claim-contentions > ul > li').should('have.length', 3);
    cy.get('.claim-contentions > ul > li:nth-child(4)').should('not.exist');
    cy.get('.show-all-button').click();
    cy.get('.claim-contentions > ul > li').should('have.length', 4);
  }

  verifyWhatWeAreDoingSection() {
    cy.get('.what-were-doing-container').should('be.visible');
    cy.get('.what-were-doing-container > h3').should(
      'contain',
      'What we’re doing',
    );
    cy.get('va-card > h4').should('contain', 'Step 3 of 8: Evidence gathering');
    cy.get('va-card')
      .shadow()
      .get('[data-cy="description"]')
      .should(
        'contain',
        'We’re reviewing your claim to make sure we have all the evidence and information we need. If we need anything else, we’ll contact you.',
      );
    cy.get('va-card')
      .shadow()
      .get('[data-cy="moved-to-date-text"]')
      .should('contain', 'Moved to this step on January 2, 2022');
    cy.get('va-card > a')
      .should('contain', 'Learn more about this step')
      .click()
      .then(() => {
        cy.url().should('contain', '/your-claims/189685/overview');
      });
  }

  verifyRecentActivity(claimClosed = false, showEightPhases = false) {
    cy.get('.recent-activity-container').should('be.visible');
    cy.get('.recent-activity-container > h3').should(
      'contain',
      'Recent activity',
    );
    cy.get('.recent-activity-container > ol > li').should(
      'have.length.greaterThan',
      0,
    );
    if (showEightPhases) {
      if (claimClosed) {
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'Your claim was decided',
        );
      } else {
        // Verify some tracked items on page 1
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We completed a review for the request: “Automated 5103 Notice Response”',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We opened a request: “Automated 5103 Notice Response”',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We closed a request: “Closed Tracked Item”',
        );
        // click the next page
        cy.get('.recent-activity-container va-pagination')
          .shadow()
          .find(
            '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a.usa-pagination__next-page',
          )
          .click();
        // Verify some tracked items on page 2
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'Your claim moved into Step 3: Evidence gathering',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We opened a request: “Closed Tracked Item”',
        );
        // click the next page
        cy.get('.recent-activity-container va-pagination')
          .shadow()
          .find(
            '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a.usa-pagination__next-page',
          )
          .click();
        // Verify some tracked items on page 3
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We received your claim in our system',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'Your claim moved into Step 2: Initial review',
        );
      }
    } else if (claimClosed) {
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 5: Closed',
      );
    } else {
      // Verify some tracked items on page 1
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'We completed a review for the request: “Automated 5103 Notice Response”',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'We opened a request: “Automated 5103 Notice Response”',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'We closed a request: “Closed Tracked Item”',
      );
      // click the next page
      cy.get('.recent-activity-container va-pagination')
        .shadow()
        .find(
          '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a.usa-pagination__next-page',
        )
        .click();
      // Verify some tracked items on page 2
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 3: Evidence gathering, review, and decision',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'We opened a request: “Closed Tracked Item”',
      );
      // click the next page
      cy.get('.recent-activity-container va-pagination')
        .shadow()
        .find(
          '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a.usa-pagination__next-page',
        )
        .click();
      // Verify some tracked items on page 3
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 1: Claim received',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 2: Initial review',
      );
    }
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
      '/track-claims/your-claims/189685/document-request/2',
    );
  }

  verifyPrimaryAlertforSubmitBuddyStatement() {
    cy.get('[data-testid="item-2"]').should('be.visible');
    cy.get('[data-testid="item-2"]')
      .shadow()
      .get('[data-testid="item-2"]:first-of-type a')
      .should('contain', 'Details');
    cy.get('[data-testid="item-2"]')
      .find('.due-date-header')
      .should(
        'contain',
        'Needed from you by February 4, 2022 - Due 3 years ago',
      );
    cy.get('[data-testid="item-2"]')
      .find('.alert-description')
      .should('contain', 'Submit Buddy Statement(s)');
    cy.get('[data-testid="item-2"]')
      .shadow()
      .get('[data-testid="item-2"]:first-of-type a')
      .click();
    cy.url().should(
      'contain',
      '/track-claims/your-claims/189685/document-request/2',
    );
  }

  // Not currently using Standard 5103 Notice. Was being used on WhatYouNeedToDo and AdditionalEvidence.
  // Waiting to see if we still need this component and logic or not.
  verifyPrimaryAlertfor5103Notice(isStandard = false, is5103Update = false) {
    const testId = isStandard
      ? '[data-testid="standard-5103-notice-alert"]'
      : '[data-testid="item-13"]';
    const url = isStandard
      ? '/track-claims/your-claims/189685/5103-evidence-notice'
      : '/track-claims/your-claims/189685/document-request/13';
    cy.get(testId).should('be.visible');
    if (isStandard || is5103Update) {
      cy.get(testId)
        .find('h4')
        .should('contain', 'Review evidence list');
    } else {
      cy.get(testId)
        .find('h4')
        .should('contain', 'Automated 5103 Notice Response');
    }
    cy.get(testId)
      .find('a')
      .should('contain', 'Details');
    cy.get(testId)
      .find('.alert-description')
      .first()
      .should(
        'contain',
        'We sent you a “List of evidence we may need (5103 notice)” letter. This letter lets you know if submitting additional evidence will help decide your claim.',
      );
    cy.get(testId)
      .find('a')
      .click();
    cy.url().should('contain', url);
  }

  verifyDocRequestforDefaultPage(is5103Notice = false) {
    cy.get('#default-page').should('be.visible');
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
    cy.get('va-additional-info').should('be.visible');
  }

  // Not currently using Standard 5103 Notice. Was being used on WhatYouNeedToDo and AdditionalEvidence.
  // Waiting to see if we still need this component and logic or not.
  verifyDocRequestfor5103Notice(isStandard = false) {
    cy.get('#default-5103-notice-page').should('be.visible');
    if (!isStandard) {
      cy.get('[data-testid="due-date-information"]').should(
        'contain',
        "Note: If you don’t submit the evidence waiver, we'll wait for you to add evidence until July 14, 2024. Then we'll continue processing your claim.",
      );
    }
    cy.get('a.active-va-link').should(
      'contain',
      'Find this letter on the claim letters page',
    );
    cy.get('a[data-testid="upload-evidence-link"]').should(
      'contain',
      'Upload additional evidence',
    );
  }

  verifyDocRequestBreadcrumbs(previousPageFiles = false, is5103Notice = false) {
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
    if (previousPageFiles) {
      cy.get('.usa-breadcrumb__list > li:nth-child(3) a').should(
        'contain',
        'Files for your compensation claim',
      );
    } else {
      cy.get('.usa-breadcrumb__list > li:nth-child(3) a').should(
        'contain',
        'Status of your compensation claim',
      );
    }
    if (is5103Notice) {
      cy.get('.usa-breadcrumb__list > li:nth-child(4) a').should(
        'contain',
        'Review evidence list (5103 notice)',
      );
    } else {
      cy.get('.usa-breadcrumb__list > li:nth-child(4) a').should(
        'contain',
        'Submit Buddy Statement(s)',
      );
    }
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
      '/track-claims/your-claims/189685/document-request/4',
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
      '/track-claims/your-claims/189685/document-request/4',
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

  verifyOverviewClaimPhaseDiagramAndStepper() {
    cy.get('#tabOverview').click();
    cy.url().should('contain', '/your-claims/189685/overview');
    cy.get('.claim-overview-header-container > h2').should(
      'contain',
      'Overview of the claim process',
    );
    cy.get('.claim-overview-header-container > p').should(
      'contain',
      'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
    );
    cy.get('.claim-phase-diagram').should('be.visible');
    cy.get('.claim-phase-stepper').should('be.visible');
  }

  verifyOverviewTimeline() {
    cy.get('#tabOverview').click();
    cy.url().should('contain', '/your-claims/189685/overview');
    cy.get('.claim-overview-header-container h2').should(
      'contain',
      'Overview of the claim process',
    );
    cy.get('.claim-overview-header-container p').should(
      'contain',
      'Learn about the VA claim process and what happens after you file your claim.',
    );
    cy.get('va-process-list').should('be.visible');
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

  verifyNeedToMailDocuments() {
    cy.get('.additional-evidence-container va-additional-info')
      .shadow()
      .find('.additional-info-title')
      .should('contain', 'Need to mail your documents?');
    cy.get('.additional-evidence-container va-additional-info')
      .shadow()
      .find('a')
      .click();
    cy.get('.additional-evidence-container va-additional-info').should(
      'contain',
      'Please upload your documents online here to help us process your claim quickly.',
    );
  }

  verifyFirstPartyFriendlyEvidenceRequest() {
    cy.get('[data-testid="item-2"]')
      .find('a.vads-c-action-link--blue')
      .click();
    cy.url().should('contain', '/needed-from-you/');
    cy.get('#default-page')
      .should('be.visible')
      .as('friendlyMessage');
    cy.assertChildText('@friendlyMessage', 'h1', 'Submit Buddy Statement(s)');
    cy.assertChildText('@friendlyMessage', 'h2', 'What we need from you');
    cy.assertChildText('@friendlyMessage', 'h2', 'Next steps');
    cy.assertChildText('@friendlyMessage', 'p', 'To respond to this request:');
    cy.assertChildText(
      '@friendlyMessage',
      'p:last-of-type',
      'You can find blank copies of many VA forms online.',
    );
  }

  verifyThirdPartyFriendlyEvidenceRequest() {
    cy.get('[data-testid^="item-from-others"]')
      .first()
      .find('a.add-your-claims-link:first-of-type')
      .click();
    cy.url().should('contain', '/needed-from-others/');
    cy.get('#default-page')
      .should('be.visible')
      .as('friendlyMessage');
    cy.assertChildText('@friendlyMessage', 'h1', 'Need form 21-4142');
    cy.assertChildText(
      '@friendlyMessage',
      'h2',
      'What we’re notifying you about',
    );
    cy.assertChildText(
      '@friendlyMessage',
      'div.optional-upload > p',
      'This is just a notice. No action is needed by you. But, if you have documents related to this request, uploading them on this page may help speed up the evidence review for your claim.',
    );
  }
}

export default TrackClaimsPageV2;
/* eslint-enable class-methods-use-this */
