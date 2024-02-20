import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

describe('Claims List Test', () => {
  it('Tests consolidated claim functionality - C30698', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.checkClaimsContent();
  });
});
