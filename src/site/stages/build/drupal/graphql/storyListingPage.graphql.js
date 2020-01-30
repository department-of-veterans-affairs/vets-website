/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment storyListingPage on NodeStoryListing {
    ${entityElementsFromPages}
    fieldOffice {
      entity {
        title
        reverseFieldOfficeNode(limit: 500, filter: {conditions: [{field: "type", value: "news_story"}, {field: "status", value: "1", operator: EQUAL}]}) {
          entities {
            ... on NodeNewsStory {
              entityId
              title
              fieldFeatured
              entityUrl {
                path
              }
              uid {
                targetId
                ... on FieldNodeUid {
                  entity {
                    name
                    timezone
                  }
                }
              }
              promote
              created
              fieldOffice {
                entity {
                  ... on NodeHealthCareRegionPage {
                    entityLabel
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
                  }
                }
              }
              fieldAuthor {
                entity {
                  ...on NodePersonProfile {
                    title
                    fieldDescription
                  }
                }
              }
              fieldImageCaption
              fieldIntroText
              fieldMedia {
                entity {
                  ... on MediaImage {
                    image {
                      alt
                      title
                      derivative(style: _21MEDIUMTHUMBNAIL) {
                        url
                        width
                        height
                      }
                    }
                  }
                }
              }
              fieldFullStory {
                processed
              }
            }
          }
        }
      }
    }
    fieldOffice {
      targetId
      entity {
        ... on NodeHealthCareRegionPage {
          entityLabel
          title
          fieldNicknameForThisFacility
        }
      }
    }
 }
`;
