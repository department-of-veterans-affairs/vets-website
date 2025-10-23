import manifest from '../../manifest.json';

const { rootUrl } = manifest;

export const pagePathIsCorrect = pagePath => {
  cy.location('pathname').should('eq', `${rootUrl}/${pagePath}`);
};
