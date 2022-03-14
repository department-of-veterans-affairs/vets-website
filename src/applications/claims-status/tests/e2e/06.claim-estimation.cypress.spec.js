import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 3).then(data => {
    mockDetails = data;
  });
});

describe('Claim Estimation Breadcrumb Test', () => {
  it('Verifies the breadcrumb contents', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyInProgressClaim();
    // Disabled until COVID-19 message removed
    // const selector = '.claim-estimate-link';
    // cy.pause(500);
    // cy.get(selector)
    //   .click()
    //   .then(() => {
    //     cy.get('.claims-paragraph-header');
    //     cy.injectAxeThenAxeCheck();
    //   });
    // cy.get('.claims-status-content h1')
    //   .should('contain', 'How we come up with your estimated decision date')
    //
    cy.expandAccordions();
    cy.axeCheck();
  });
});
