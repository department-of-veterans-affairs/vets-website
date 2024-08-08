import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claims List Test', () => {
  it('Tests consolidated claim functionality - C30698', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.checkClaimsContent();
  });
});
