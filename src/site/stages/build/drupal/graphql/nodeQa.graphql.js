const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle
}
`;

module.exports = fragment;
