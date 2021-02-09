const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const socialMediaFields = require('./facilities-fragments/healthCareSocialMedia.fields.graphql');
const serviceLocation = require('./paragraph-fragments/serviceLocation.paragraph.graphql');
const appointmentItems = require('./file-fragments/appointmentItems.graphql');

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
  limit = 100,
) {
  return `
    ${fragments.listOfLinkTeasers}
    ${fragments.linkTeaser}
    ${healthCareLocalFacilityPageFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "changed", direction:  ASC }
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

module.exports = {
  fragment: healthCareLocalFacilityPageFragment,
  NodeHealthCareLocalFacilityPageSlices: {
    GetNodeHealthCareLocalFacilityPagesSlice1: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice1',
      0,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice2: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice2',
      100,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice3: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice3',
      200,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice4: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice4',
      300,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice5: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice5',
      400,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice6: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice6',
      500,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice7: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice7',
      600,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice8: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice8',
      700,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice9: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice9',
      800,
    ),
    GetNodeHealthCareLocalFacilityPagesSlice10: getNodeHealthCareLocalFacilityPagesSlice(
      'GetNodeHealthCareLocalFacilityPagesSlice10',
      900,
      9999,
    ),
  },
};
