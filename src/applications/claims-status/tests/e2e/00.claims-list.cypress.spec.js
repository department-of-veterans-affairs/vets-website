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

  it('Displays server-generated claim titles in list view', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);

    // Verify server-generated displayTitle is shown in list view
    cy.get('.claim-list-item-header')
      .first()
      .should('contain', 'Claim for compensation');

    cy.axeCheck();
  });

  it('Falls back to client-side titles when server fields absent', () => {
    // Create mock data without displayTitle/claimTypeBase fields
    const claimsListLegacy = {
      data: claimsList.data.map(claim => ({
        ...claim,
        attributes: {
          ...claim.attributes,
          displayTitle: undefined,
          claimTypeBase: undefined,
        },
      })),
    };

    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsListLegacy, claimDetail);

    // Verify client-side title generation still works
    cy.get('.claim-list-item-header')
      .first()
      .should('contain', 'Claim for compensation');

    cy.axeCheck();
  });
});
