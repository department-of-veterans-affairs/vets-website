import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, false, false, 3).then(data => {
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
    // cy.get('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]')
    //   .should('exist')
    //   .then(breadcrumb => {
    //     cy.wrap(breadcrumb).should('contain', 'Estimated decision date');
    //     cy.wrap(breadcrumb).should('have.css', 'pointer-events', 'none');
    //   });
    cy.expandAccordions();
    cy.axeCheck();
  });
});
