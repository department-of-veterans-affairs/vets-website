/* eslint-disable cypress/unsafe-to-chain-command */
// START lighthouse_migration
import featureToggleClaimDetailV2Enabled from '../fixtures/mocks/lighthouse/feature-toggle-claim-detail-v2-enabled.json';
import featureToggleClaimPhasesEnabled from '../fixtures/mocks/lighthouse/feature-toggle-claim-phases-enabled.json';
import featureToggle5103UpdateEnabled from '../fixtures/mocks/lighthouse/feature-toggle-5103-update-enabled.json';
import featureToggle5103UpdateEnabledV2 from '../fixtures/mocks/lighthouse/feature-toggle-5103-update-enabled-v2.json';
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
  ) {
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

  submitFilesForReview(isOldVersion = false) {
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

    if (isOldVersion) {
      cy.get('va-checkbox')
        .shadow()
        .find('input[type="checkbox"]')
        .check({ force: true });
      cy.get('va-button.submit-files-button')
        .shadow()
        .find('button')
        .click();
    } else {
      cy.get('va-checkbox')
        .shadow()
        .find('input[type="checkbox"]')
        .check({ force: true });
      cy.get('va-button#submit')
        .shadow()
        .find('button')
        .click();
    }

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
          .find('#error-message')
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
      .should('contain', 'Moved to this step on January 1, 2022');
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
        cy.get('.recent-activity-container va-pagination')
          .shadow()
          .find(
            '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a',
          )
          .click();
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'We received your claim in our system',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'Your claim moved into Step 2: Initial review',
        );
        cy.get('.recent-activity-container > ol > li > p').should(
          'contain',
          'Your claim moved into Step 3: Evidence gathering',
        );
      }
    } else if (claimClosed) {
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 5: Closed',
      );
    } else {
      cy.get('.recent-activity-container va-pagination')
        .shadow()
        .find(
          '.usa-pagination__list > li.usa-pagination__item.usa-pagination__arrow > a',
        )
        .click();
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 1: Claim received',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 2: Initial review',
      );
      cy.get('.recent-activity-container > ol > li > p').should(
        'contain',
        'Your claim moved into Step 3: Evidence gathering, review, and decision',
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
        'Needed from you by February 4, 2022 - Due 2 years ago',
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

  verifyPrimaryAlertfor5103Notice(isStandard = false) {
    const testId = isStandard
      ? '[data-testid="standard-5103-notice-alert"]'
      : '[data-testid="item-13"]';
    const url = isStandard
      ? '/track-claims/your-claims/189685/5103-evidence-notice'
      : '/track-claims/your-claims/189685/document-request/13';
    cy.get(testId).should('be.visible');
    if (isStandard) {
      cy.get(testId)
        .find('h4')
        .should('contain', '5103 Evidence Notice');
    } else {
      cy.get(testId)
        .find('h4')
        .should('contain', 'Automated 5103 Notice Response');
    }
    cy.get(testId)
      .find('a')
      .should('contain', 'Details');
    cy.get(testId)
      .find('.alert-description > p')
      .first()
      .should(
        'contain',
        'We sent you a "5103 notice" letter that lists the types of evidence we may need to decide your claim.',
      )
      .next()
      .should(
        'contain',
        'Upload the waiver attached to the letter if you’re finished adding evidence.',
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
        'Needed from you by February 4, 2022 - Due 2 years ago',
      );
    }
    cy.get('va-additional-info').should('be.visible');
  }

  verifyDocRequestfor5103Notice(isStandard = false) {
    cy.get('#default-5103-notice-page').should('be.visible');
    if (!isStandard) {
      cy.get('[data-testid="due-date-information"]').should(
        'contain',
        'You don’t need to do anything on this page. We’ll wait until July 14, 2024, to move your claim to the next step.',
      );
    }
    cy.get('a.active-va-link').should('contain', 'Go to claim letters');
    cy.get('a[data-testid="upload-evidence-link"]').should(
      'contain',
      'Upload your evidence here',
    );
    cy.get('va-checkbox')
      .shadow()
      .find('label')
      .should('contain', 'I’m finished adding evidence to support my claim.');
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
        '5103 Evidence Notice',
      );
    } else {
      cy.get('.usa-breadcrumb__list > li:nth-child(4) a').should(
        'contain',
        'Request for Submit Buddy Statement(s)',
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
