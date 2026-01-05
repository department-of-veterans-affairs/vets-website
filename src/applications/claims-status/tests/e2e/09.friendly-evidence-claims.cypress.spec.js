import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('Friendly evidence request text', () => {
  context('First-party evidence requests', () => {
    it('Shows the correct first-party headings and explanation', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        false,
        false,
        true,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyFirstPartyFriendlyEvidenceRequest();
      cy.injectAxeThenAxeCheck();
    });
  });

  context('Third-party evidence requests', () => {
    it('Shows the correct third-party headings and explanation', () => {
      const trackClaimsPage = new TrackClaimsPageV2();
      trackClaimsPage.loadPage(
        claimsList,
        claimDetailsOpen,
        false,
        false,
        false,
        false,
        true,
      );
      trackClaimsPage.verifyInProgressClaim(false);
      trackClaimsPage.verifyThirdPartyFriendlyEvidenceRequest();
      cy.injectAxeThenAxeCheck();
    });
  });
});
