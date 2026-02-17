import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetails from './fixtures/mocks/lighthouse/claim-detail-closed.json';
import claimDetail from './fixtures/mocks/lighthouse/claim-detail.json';

describe('Claims status test', () => {
  it('Shows the correct status for the claim - C30820', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetails);
    trackClaimsPage.verifyInProgressClaim(false);
    cy.injectAxeThenAxeCheck();
  });

  it('Displays server-generated titles in breadcrumb and detail header', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, claimDetail);

    // Click into claim detail
    cy.get('.claim-list-item:first-child va-link').shadow().find('a').click();

    // Verify detail header uses displayTitle
    cy.get('.claim-title')
      .should('be.visible')
      .should('contain', 'Claim for compensation');

    // Verify breadcrumb uses claimTypeBase composition
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('.usa-breadcrumb__list > li:nth-child(3) a').should(
      'contain',
      'Status of your compensation claim',
    );

    cy.injectAxeThenAxeCheck();
  });

  it('Preserves correct casing in breadcrumb composition', () => {
    // Create a Veterans Pension claim to test casing preservation
    const pensionClaimDetail = {
      data: {
        ...claimDetail.data,
        attributes: {
          ...claimDetail.data.attributes,
          claimType: 'Pension',
          claimTypeCode: '180ORGPENPMC',
          displayTitle: 'Claim for Veterans Pension',
          claimTypeBase: 'veterans pension claim',
        },
      },
    };

    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, pensionClaimDetail);

    cy.get('.claim-list-item:first-child va-link').shadow().find('a').click();

    // Verify breadcrumb preserves "veterans pension" with correct casing
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('.usa-breadcrumb__list > li:nth-child(3) a')
      .should('contain', 'Status of your veterans pension claim')
      .should('contain', 'veterans pension'); // Lowercase 'v' is intentional

    cy.injectAxeThenAxeCheck();
  });
});
