import claimsListEmpty from './fixtures/mocks/lighthouse/claims-list-empty.json';
import TrackClaimsPage from './page-objects/TrackClaimsPage';

describe('Breadcrumb Test Empty List', () => {
  it('Verifies functionality with an empty list - C30696', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsListEmpty);
    trackClaimsPage.verifyNoClaims();
    cy.expandAccordions();
    cy.axeCheck();
  });
});
