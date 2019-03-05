/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const FACILITIES_RESULTS = `
  entities {
    ... on NodeHealthCareLocalFacility {
      entityUrl {
        path
      }
      entityBundle
      title
      changed
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
      fieldMainLocation
      fieldMedia {
        entity {
          ... on MediaImage {
            image {
              alt
              title
              derivative(style: CROP_3_2) {
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
    filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "field_main_location", value: "${
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
