import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail-closed.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('A user can navigate to their claim details of a closed claim', () => {
  it('Shows the correct status for the claim - C30820', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    cy.axeCheck();
  });
});

describe('A user can navigate to their claim details of an open claim', () => {
  it('Shows the correct status for the claim - C30820', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    cy.axeCheck();
  });
});

describe('On a closed claim, a user with more than 3 contentions can click "Show full list" button and see more contentions', () => {
  it('Has "Show full list" button which reveals more contentions when clicked', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyContentions();
    cy.axeCheck();
  });
});

describe('On an open claim, a user with more than 3 contentions can click "Show full list" button and see more contentions', () => {
  it('Has "Show full list" button which reveals more contentions when clicked', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyContentions();
    cy.axeCheck();
  });
});

describe('A user that has tracked items can view recent activity', () => {
  it('Shows recent activity for a user with tracked items on a closed claim', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyRecentActivity();
    cy.axeCheck();
  });

  it('Shows recent activity for a user with tracked items on a open claim', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyRecentActivity();
    cy.axeCheck();
  });
});

describe('On a closed claim, a user that has more than 10 tracked items gets pagination on recent activity page', () => {
  it('Shows pagination for a user with more than 10 tracked items', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyRecentActivityPagination();
    cy.axeCheck();
  });
});

describe('On an open claim, a user that has more than 10 tracked items gets pagination on recent activity page', () => {
  it('Shows pagination for a user with more than 10 tracked items', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyRecentActivityPagination();
    cy.axeCheck();
  });
});

describe('A user can view primary alert details', () => {
  it('Shows primary alert details', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyPrimaryAlert();
    cy.axeCheck();
  });
});

describe('A user can view secondary alert details', () => {
  it('Shows secondary alert details on a closed claim', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    trackClaimsPage.verifyClosedClaimSecondaryAlert();
    cy.axeCheck();
  });

  it('Shows secondary alert details in Recent Activity on an open claim', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyOpenClaimSecondaryAlertInRecentActivity();
    cy.axeCheck();
  });
});

describe('A user can view the overview of the process', () => {
  it('Shows the overview of the process', () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.verifyOverviewOfTheProcess();
    cy.axeCheck();
  });
});
