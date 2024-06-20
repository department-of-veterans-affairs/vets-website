import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('When feature toggle cst_claim_phases disabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.submitFilesForReview(true);
        cy.axeCheck();
      });
    });

    context('when alert is a 5103 Notice', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestforDefaultPage(true);
        trackClaimsPage.submitFilesForReview(true);
        cy.axeCheck();
      });
    });
  });
});

describe('When feature toggle cst_claim_phases enabled and cst_5103_update enabled', () => {
  context('A user can view primary alert details from the status tab', () => {
    context('when alert is a Submit Buddy Statement', () => {
      it('Shows primary alert details', () => {
        const trackClaimsPage = new TrackClaimsPageV2();
        trackClaimsPage.loadPage(
          claimsList,
          claimDetailsOpen,
          false,
          false,
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertforSubmitBuddyStatement();
        trackClaimsPage.verifyDocRequestforDefaultPage();
        trackClaimsPage.submitFilesForReview(true);
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
          true,
        );
        trackClaimsPage.verifyInProgressClaim(false);
        trackClaimsPage.verifyPrimaryAlertfor5103Notice();
        trackClaimsPage.verifyDocRequestfor5103Notice();
        trackClaimsPage.submitEvidenceWaiver();
        cy.axeCheck();
      });
    });
  });
});
