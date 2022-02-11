/**
 * [TestRail-integrated] Spec for Header
 * @testrailinfo projectId 8
 * @testrailinfo suiteId 9
 * @testrailinfo groupId 2970
 * @testrailinfo runName SH-e2e-MegaMenu
 */
const axeTestPage = () => {
  cy.injectAxe();
  cy.axeCheck('main', {
    rules: {
      'aria-roles': {
        enabled: false,
      },
    },
  });
};

describe('Header', () => {
  it('it works as expected - C12279', () => {
    // Navigate to the homepage and axe check it.
    cy.visit('/');

    // A11y check the search results.
    axeTestPage();
  });
});
