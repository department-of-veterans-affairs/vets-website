import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('"Ask For Your Claim Decision" card', () => {
  it('A user can click "view details"', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen, true);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.askForClaimDecision();
    cy.axeCheck();
  });

  it('redirects to the Status tab if a user clicks "Not yet - I still have more evidence to submit"', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen, true);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    trackClaimsPage.askForClaimDecisionNoNotYet();
    cy.axeCheck();
  });
});
