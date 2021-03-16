/**
 * Entity-level elements common to entities that generate html pages
 */
module.exports = `
    entityBundle
    entityId
    entityPublished
    title
    vid
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
    entityMetatags {
      __typename
      key
      value
    }
`;
