import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail-closed.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('When a claim is closed', () => {
  it("shows the user's timeline on the Overview tab", () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyOverviewTimeline();
    cy.axeCheck();
  });
});

describe('When a claim is open', () => {
  it("shows the user's timeline on the Overview tab", () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyOverviewTimeline();
    cy.axeCheck();
  });
});

describe('On the overview tab', () => {
  it("shows a user's past updates when they click 'Show past updates' on the third step", () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyOverviewShowPastUpdates();
    cy.axeCheck();
  });
});
