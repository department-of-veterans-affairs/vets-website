import moment from 'moment';

import TrackClaimsPage from './page-objects/TrackClaimsPage';
import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(
    false,
    true,
    false,
    6,
    moment()
      .subtract(5, 'years')
      .format('YYYY-MM-DD'),
  ).then(data => {
    mockDetails = data;
  });
});

describe('Claims status est current test', () => {
  it('Shows the correct status for the claim', () => {
    const trackClaimsPage = new TrackClaimsPage();
    trackClaimsPage.loadPage(claimsList, mockDetails);
    trackClaimsPage.verifyInProgressClaim();
    cy.expandAccordions();
    cy.axeCheck();
  });
});
