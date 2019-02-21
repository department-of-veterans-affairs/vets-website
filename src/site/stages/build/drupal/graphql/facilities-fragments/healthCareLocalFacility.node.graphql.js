/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const FACILITIES_RESULTS = `
  entities {
    ... on NodeHealthCareLocalFacility {
      fieldFacilityLocatorApiId
      fieldNicknameForThisFacility
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

module.exports = `
  mainFacilities: reverseFieldRegionPageNode(filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "field_main_location", value: "1", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}) {
    ${FACILITIES_RESULTS}
  }
  otherFacilities: reverseFieldRegionPageNode(filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "field_main_location", value: "0", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}) {
    ${FACILITIES_RESULTS}
  }
`;
