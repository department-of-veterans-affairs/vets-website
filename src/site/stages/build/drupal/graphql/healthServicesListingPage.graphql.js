/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const healthServicesListingPage = `
 fragment healthServicesListingPage on NodeHealthServicesListing {
    ${entityElementsFromPages}
    title
    fieldIntroText
    fieldFeaturedContentHealthser {
      entity {
        ... on ParagraphLinkTeaser {
          entityId
          fieldLinkSummary
          fieldLink {
            title
            url {
              path
            }
          }
        }
      }
    }
    entityUrl {
      path
    }
    fieldOffice {
      entity {
        entityUrl {
          path
        }
        title
        reverseFieldRegionPageNode(limit: 500, filter: {conditions: [{field: "type", value: "regional_health_care_service_des"}, {field: "status", value: "1", operator: EQUAL}]}) {
          entities {
            ... on NodeRegionalHealthCareServiceDes {
              entityId
              entityType
              entityUrl {
                path
              }
              fieldBody {
                processed
              }
              fieldLocalHealthCareService {
                entity {
                  ... on NodeHealthCareLocalHealthService {
                    entityUrl {
                      path
                    }
                    fieldFacilityLocation {
                      entity {
                        ... on NodeHealthCareLocalFacility {
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
                          title
                        }
                      }
                    }
                  }
                }
              }
              fieldServiceNameAndDescripti {
                entity {
                  ... on TaxonomyTermHealthCareServiceTaxonomy {
                    weight
                    entityId
                    entityBundle
                    fieldAlsoKnownAs
                    fieldCommonlyTreatedCondition
                    name
                    description {
                      processed
                    }
                    parent {
                      entity {
                        ... on TaxonomyTermHealthCareServiceTaxonomy {
                          weight
                          name
                        }
                      }
                    }
                  }
                }
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
        }
      }
    }
 }
`;

function getNodeHealthServicesListingPages(operationName, offset, limit = 5) {
  return `
    ${healthServicesListingPage}
    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "title", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["health_services_listing"] }
          ]
      }) {
        entities {
          ... healthServicesListingPage
        }
      }
    }
`;
}

module.exports = {
  fragment: healthServicesListingPage,
  NodeHealthServicesListingPageSlices: {
    GetNodeHealthServicesListingPageSlice1: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice1',
      0,
    ),
    GetNodeHealthServicesListingPageSlice2: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice2',
      5,
    ),
    GetNodeHealthServicesListingPageSlice3: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice3',
      10,
    ),
    GetNodeHealthServicesListingPageSlice4: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice4',
      15,
    ),
    GetNodeHealthServicesListingPageSlice5: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice5',
      20,
    ),
    GetNodeHealthServicesListingPageSlice6: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice6',
      25,
    ),
    GetNodeHealthServicesListingPageSlice7: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice7',
      30,
    ),
    GetNodeHealthServicesListingPageSlice8: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice8',
      35,
    ),
    GetNodeHealthServicesListingPageSlice9: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice9',
      40,
    ),
    GetNodeHealthServicesListingPageSlice10: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice10',
      45,
    ),
    GetNodeHealthServicesListingPageSlice11: getNodeHealthServicesListingPages(
      'GetNodeHealthServicesListingPageSlice11',
      50,
      9999,
    ),
  },
};
