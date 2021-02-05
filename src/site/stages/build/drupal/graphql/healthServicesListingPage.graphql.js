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

const GetNodeHealthServicesListingPages = `

  ${healthServicesListingPage}

  query GetNodeHealthServicesListingPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
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

module.exports = {
  fragment: healthServicesListingPage,
  GetNodeHealthServicesListingPages,
};
