/**
 * An event detail page
 * Example: /pittsburgh-health-care/events/example-event
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
 fragment healthServicesListingPage on NodeHealthServicesListing {
    ${entityElementsFromPages}
    title
    fieldIntroText
    fieldFeaturedContentHealthser {
      entity {
        ... on ParagraphLinkTeaser {
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
                          fieldNicknameForThisFacility
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
          fieldNicknameForThisFacility
        }
      }
    }
 }
`;
