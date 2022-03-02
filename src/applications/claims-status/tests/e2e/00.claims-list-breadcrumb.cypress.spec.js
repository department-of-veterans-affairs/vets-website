import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

describe('Breadcrumb Test', () => {
  it('Verifies breadcrumb functionality', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList);
    trackClaimsPage.checkBreadcrumbs();
    trackClaimsPage.checkBreadcrumbsMobile();
    cy.expandAccordions();
    cy.axeCheck();
  });
});
