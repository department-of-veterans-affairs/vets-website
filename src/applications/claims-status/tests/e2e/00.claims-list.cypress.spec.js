import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

describe('Claims List Test', () => {
  it('Tests consolidated claim functionality', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList);
    cy.expandAccordions();
    cy.axeCheck();
    trackClaimsPage.checkClaimsContent();
  });
});
