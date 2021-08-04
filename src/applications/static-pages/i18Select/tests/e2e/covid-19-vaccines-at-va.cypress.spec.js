import Timeouts from 'platform/testing/e2e/timeouts';

describe('COVID-19 vaccines at VA I18Select flow', () => {
  it('should show I18Select component', () => {
    cy.visit('health-care/covid-19-vaccine');

    cy.injectAxe();
    // Select I18Select English language link
    cy.findByRole('link', { name: 'English', timeout: Timeouts.normal }).should(
      'exist',
    );
  });
});
