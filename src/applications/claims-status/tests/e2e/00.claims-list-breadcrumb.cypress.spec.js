import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';

describe.skip('Breadcrumb Test', () => {
  it('Verifies breadcrumb functionality - C30694', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList);
    trackClaimsPage.checkBreadcrumbs();
    trackClaimsPage.checkBreadcrumbsMobile();
    cy.expandAccordions();
    cy.axeCheck('va-nav-breadcrumbs');
  });
});
