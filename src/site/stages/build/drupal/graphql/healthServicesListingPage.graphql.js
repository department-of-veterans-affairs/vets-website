/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

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

function getNodeHealthServicesListingPages(operationName, offset, limit) {
  return `
    ${healthServicesListingPage}
    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
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

function getNodeHealthServicesListingPageQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeHealthServicesListingPage',
    entitiesPerSlice: 5,
    totalEntities: entityCounts.data.healthServicesListing.count,
    getSlice: getNodeHealthServicesListingPages,
  });
}

module.exports = {
  fragment: healthServicesListingPage,
  getNodeHealthServicesListingPageQueries,
};
