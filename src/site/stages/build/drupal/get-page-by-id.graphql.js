const { gql } = require('apollo-boost');

module.exports = gql`
  query GetAllPages($path: String!) {
    route: route(path: $path) {
      ... on EntityCanonicalUrl {
        entity {
          ... on NodePage {
            nid
            entityUrl {
              path
              routed
            }
            entityBundle
            entityPublished
            title
            fieldIntroText
            fieldContentBlock {
              entity {
                ... on Paragraph {
                  id
                  entityBundle
                  entityRendered
                }
              }
            }
          }
        }
      }
    }
  }
`;
