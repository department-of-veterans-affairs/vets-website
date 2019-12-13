/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const FACILITIES_RESULTS = `
  entities {
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
      entityBundle
      title
      entityId
      entityBundle
      changed
      fieldOperatingStatusFacility
      fieldFacilityLocatorApiId
      fieldNicknameForThisFacility
      fieldIntroText
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
    }
  }
`;

function queryFilter(isMainLocation) {
  return `
    filter: {conditions: [{field: "status", value: "1", operator: EQUAL, enabled: $onlyPublishedContent}, {field: "field_main_location", value: "${
      isMainLocation ? '1' : '0'
    }", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}
  `;
}

module.exports = `
  mainFacilities: reverseFieldRegionPageNode(${queryFilter(true)}) {
    ${FACILITIES_RESULTS}
  }
  otherFacilities: reverseFieldRegionPageNode(${queryFilter(false)}) {
    ${FACILITIES_RESULTS}
  }
`;
