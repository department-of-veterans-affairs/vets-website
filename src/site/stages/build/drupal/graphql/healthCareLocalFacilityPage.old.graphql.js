const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment healthCareLocalFacilityPage on NodeHealthCareLocalFacility {
    ${entityElementsFromPages}
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
`;
