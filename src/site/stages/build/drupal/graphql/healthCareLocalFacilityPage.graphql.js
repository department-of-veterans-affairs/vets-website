const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const socialMediaFields = require('./facilities-fragments/healthCareSocialMedia.fields.graphql');
const serviceLocation = require('./paragraph-fragments/serviceLocation.paragraph.graphql');
const appointmentItems = require('./file-fragments/appointmentItems.graphql');

const { generatePaginatedQueries } = require('../individual-queries-helpers');

const healthCareLocalFacilityPageFragment = `
  fragment healthCareLocalFacilityPage on NodeHealthCareLocalFacility {
    ${entityElementsFromPages}
    changed
    fieldFacilityLocatorApiId
    title
    fieldIntroText
    fieldOperatingStatusFacility
    fieldLocationServices {
      entity {
        ... on ParagraphHealthCareLocalFacilityServi {
          entityId
          entityBundle
          fieldTitle
          fieldWysiwyg {
            processed
          }
        }
      }
    }
    fieldAddress {
      addressLine1
      locality
      administrativeArea
      postalCode
    }
    fieldPhoneNumber
    fieldMentalHealthPhone
    fieldFacilityHours {
      value
    }
    fieldMainLocation
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: _32MEDIUMTHUMBNAIL) {
                url
                width
                height
            }
          }
        }
      }
    }
    fieldRegionPage {
      entity {
        ... on NodeHealthCareRegionPage {
          entityBundle
          entityId
          entityPublished
          title
          fieldRelatedLinks {
            entity {
              ... listOfLinkTeasers
            }
          }
          fieldGovdeliveryIdEmerg
          fieldGovdeliveryIdNews
          fieldOperatingStatus {
            url {
              path
            }
          }
        }
      }
    }
    ${socialMediaFields}
    fieldLocalHealthCareService {
      entity {
        ... on NodeHealthCareLocalHealthService {
          fieldBody {
            processed
          }
          ${serviceLocation}
          ${appointmentItems}
          fieldRegionalHealthService
          {
            entity {
              ... on NodeRegionalHealthCareServiceDes {
                entityBundle
                fieldBody {
                  processed
                }
                fieldServiceNameAndDescripti {
                  entity {
                    ... on TaxonomyTermHealthCareServiceTaxonomy {
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
                          ...on TaxonomyTermHealthCareServiceTaxonomy {
                            name
                          }
                        }
                      }
                      fieldHealthServiceApiId
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
`;

function getNodeHealthCareLocalFacilityPagesSlice(
  operationName,
  offset,
  limit,
) {
  return `
    ${fragments.listOfLinkTeasers}
    ${fragments.linkTeaser}
    ${healthCareLocalFacilityPageFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["health_care_local_facility"] }
          ]
      }) {
        entities {
          ... healthCareLocalFacilityPage
        }
      }
    }
  `;
}

function getNodeHealthCareLocalFacilityPageQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodeHealthCareLocalFacilityPages',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.healthCareLocalFacility.count,
    getSlice: getNodeHealthCareLocalFacilityPagesSlice,
  });
}

module.exports = {
  fragment: healthCareLocalFacilityPageFragment,
  getNodeHealthCareLocalFacilityPageQueries,
};
