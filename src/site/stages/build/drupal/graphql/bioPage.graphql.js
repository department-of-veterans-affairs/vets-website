/**
 * A person profile detail page
 *
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { cmsFeatureFlags } = global;

module.exports = `
 fragment bioPage on NodePersonProfile {
  ${entityElementsFromPages}
  fieldNameFirst
  fieldLastName
  fieldSuffix
  fieldDescription
  fieldEmailAddress
  fieldPhoneNumber
  fieldCompleteBiography { entity { url } }
  fieldOffice {
      entity {
        entityLabel
        entityType
        ...on NodeHealthCareRegionPage {
          ${entityElementsFromPages}
          fieldNicknameForThisFacility
        }
      }
    }
  fieldIntroText
  fieldPhotoAllowHiresDownload
  fieldMedia {
    entity {
      ... on MediaImage {
        image {
          alt
          title
          url
          ${
            cmsFeatureFlags.FEATURE_IMAGE_STYLE_23
              ? 'derivative(style: _23MEDIUMTHUMBNAIL) {url width height}'
              : 'derivative(style: CROP32) {url width height}'
          }
        }
      }
    }
  }
  fieldBody {
    processed
  }
  changed
 }
`;
