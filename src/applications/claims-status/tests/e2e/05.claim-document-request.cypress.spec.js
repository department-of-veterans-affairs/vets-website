import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('When feature toggle cst_use_claim_details_v2 and cst_5103_update_enabled disabled', () => {
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(claimsList, claimDetail);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyNumberOfTrackedItems(4);
        trackClaimsPage.verifyNumberOfFiles(15);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(claimsList, claimDetail);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyNumberOfTrackedItems(4);
        trackClaimsPage.verifyNumberOfFiles(15);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestforDefaultPage(true);
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });
  });
});

describe('When feature toggle cst_use_claim_details_v2 enabled and cst_5103_update_enabled disabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestforDefaultPage(true, true);
        trackClaimsPage.verifyDocRequestBreadcrumbs(false, true);
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });
  });
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestforDefaultPage(true, true);
        trackClaimsPage.verifyDocRequestBreadcrumbs(true, true);
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });
  });
});

describe('When feature toggle cst_use_claim_details_v2 disabled and cst_5103_update_enabled enabled', () => {
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(claimsList, claimDetail, false, true);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyNumberOfTrackedItems(4);
        trackClaimsPage.verifyNumberOfFiles(15);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview();
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPage();
        trackClaimsPage.loadPage(claimsList, claimDetail, true, true);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyNumberOfTrackedItems(4);
        trackClaimsPage.verifyNumberOfFiles(15);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
});

describe('When feature toggle cst_use_claim_details_v2 and cst_5103_update_enabled enabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs();
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(false, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
  context('A user can view primary alert details from the files tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true);
        trackClaimsPage.submitFilesForReview(false);
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          true,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.navigateToFilesTab();
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.verifyDocRequestBreadcrumbs(true, true);
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
});
