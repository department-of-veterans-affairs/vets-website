const { gql } = require('apollo-boost');

module.exports = gql`
  {
    nodeQuery {
      count
      entities {
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
`;
