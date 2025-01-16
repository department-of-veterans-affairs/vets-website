
const initializeApi = () => {
  cy.intercept('GET', '/v0/user', userMock);
};

export { initializeApi };
