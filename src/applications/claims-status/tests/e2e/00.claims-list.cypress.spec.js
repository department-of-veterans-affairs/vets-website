import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

describe('Claimst List Test', () => {
  it('Tests consolidated claim functionality', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList);
    trackClaimsPage.checkConsolidatedClaimsModal();
    trackClaimsPage.checkClaimsContent();
  });
});
