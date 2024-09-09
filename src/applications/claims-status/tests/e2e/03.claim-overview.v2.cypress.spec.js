import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail-closed.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('When feature toggle cst_claim_phases disabled', () => {
  context('When a claim is closed', () => {
    it("shows the user's timeline on the Overview tab", () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(claimsList, claimDetails);
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyOverviewTimeline();
      cy.axeCheck();
    });
  });

  context('When a claim is open', () => {
    it("shows the user's timeline on the Overview tab", () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.verifyOverviewTimeline();
      cy.axeCheck();
    });
  });
});

describe('When feature toggle cst_claim_phases enabled', () => {
  context('When a claim is closed', () => {
    it("shows the user's timeline on the Overview tab", () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(claimsList, claimDetails, false, true);
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyOverviewClaimPhaseDiagramAndStepper();
      cy.axeCheck();
    });
  });

  context('When a claim is open', () => {
    it("shows the user's timeline on the Overview tab", () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(claimsList, claimDetailsOpen, false, true);
      trackClaimsPage.verifyInProgressClaim(true);
      trackClaimsPage.verifyOverviewClaimPhaseDiagramAndStepper();
      cy.axeCheck();
    });
  });
});
