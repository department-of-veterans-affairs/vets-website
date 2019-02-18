/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

module.exports = `
  mainFacilities: reverseFieldRegionPageNode(filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "field_main_location", value: "1", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}) {
    entities {
      ... on NodeHealthCareLocalFacility {
        entityId
        entityBundle
        fieldIntroText
        fieldFacilityLocatorApiId
        fieldNicknameForThisFacility
        fieldMainLocation
        changed
        fieldLocationServices {
          entity {
            ... on ParagraphHealthCareLocalFacilityServi {
              fieldTitle
              fieldWysiwyg {
                processed
              }
              entityBundle
              entityId
            }
          }
        }
      }
    }
  }
  otherFacilities: reverseFieldRegionPageNode(filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "field_main_location", value: "0", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}) {
    entities {
      ... on NodeHealthCareLocalFacility {
        entityId
        entityBundle
        fieldIntroText
        fieldFacilityLocatorApiId
        fieldNicknameForThisFacility
        fieldMainLocation
        changed
        fieldLocationServices {
          entity {
            ... on ParagraphHealthCareLocalFacilityServi {
              fieldTitle
              fieldWysiwyg {
                processed
              }
              entityBundle
              entityId
            }
          }
        }
      }
    }
  }
`;
