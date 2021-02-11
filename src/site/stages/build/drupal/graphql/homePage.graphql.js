/**
 * Home page
 */

const menu = 'homepage-top-tasks-blocks';
const hubListQueue = 'home_page_hub_list';
const promoBlocksQueue = 'home_page_promos';

const query = `
  homePageMenuQuery:menuByName(name: "${menu}") {
    name
    links {
      label
      url {
        path
      }
      links {
        label
        url {
          path
        }
      }
    }
  }
  homePageHubListQuery: entitySubqueueById(id: "${hubListQueue}") {
    ... on EntitySubqueueHomePageHubList {
      itemsOfEntitySubqueueHomePageHubList {
        entity {
          ... on NodeLandingPage {
            entityId
            entityLabel
            fieldTeaserText
            fieldTitleIcon
            fieldHomePageHubLabel
            entityUrl {
              path
              routed
            }
          }
        }
      }
    }
  }
  homePagePromoBlockQuery: entitySubqueueById(id: "${promoBlocksQueue}") {
    ... on EntitySubqueueHomePagePromos {
      itemsOfEntitySubqueueHomePagePromos {
         entity {
          entityId
          ... on BlockContentPromo {
            entityId
            entityLabel
            fieldImage {
              targetId
              entity {
                ...on MediaImage {
                  image {
                    url
                    alt
                  }
                }

              }
            }
            fieldPromoLink {
              targetId
              ...on FieldBlockContentPromoFieldPromoLink {
                entity {
                  ... on ParagraphLinkTeaser {
                    fieldLink {
                      uri
                      title
                      options
                    }
                    fieldLinkSummary
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

module.exports = query;
