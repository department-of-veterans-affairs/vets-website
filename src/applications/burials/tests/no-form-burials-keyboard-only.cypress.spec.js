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
    cy.visit('/burials-and-memorials/application/530');
    cy.injectAxeThenAxeCheck();
  });
});
