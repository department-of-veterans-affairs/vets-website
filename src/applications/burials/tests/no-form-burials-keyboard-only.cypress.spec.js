import mockUser from './e2e/fixtures/mocks/mockUser';
// import burial1234 from './e2e/fixtures/mocks/burial-1234.json';
// import burialPost from './e2e/fixtures/mocks/burial-post.json';
// // This also works with maximal-test.json
// import testData from './schema/minimal-test.json';

describe('Burials keyboard only navigation', () => {
  it('navigates through temporary review page', () => {
    cy.login({
      data: {
        attributes: {
          ...mockUser.data.attributes,
          // eslint-disable-next-line camelcase
          // in_progress_forms: [], // clear out in-progress state
        },
      },
    });
    cy.visit('/burials-and-memorials/application/530/introduction');
    cy.injectAxeThenAxeCheck();

    cy.get('a').each($link => {
      const href = $link.prop('href');

      // Perform an HTTP HEAD request
      cy.request({
        url: href,
        method: 'HEAD',
        failOnStatusCode: false, // This ensures that Cypress doesn't fail the test on a non-2xx status code
      }).then(response => {
        // Assert that the link returns a non-4xx status code
        expect(response.status).to.not.be.within(400, 499);
      });
    });
  });
});
