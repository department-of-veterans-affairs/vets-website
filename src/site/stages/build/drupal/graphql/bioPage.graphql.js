/**
 * A person profile detail page
 *
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('../../../../utilities/featureFlags');

module.exports = `
 fragment bioPage on NodePersonProfile {
  ${entityElementsFromPages}
  fieldNameFirst
  fieldLastName
  fieldSuffix
  fieldDescription
  fieldEmailAddress
  fieldPhoneNumber
  ${
    enabledFeatureFlags[featureFlags.FEATURE_FIELD_COMPLETE_BIOGRAPHY]
      ? 'fieldCompleteBiography { entity { url } }'
      : ''
  }
  fieldOffice {
    entity {
      entityLabel
      entityType
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
          derivative(style: CROP32) {
            url
            width
            height
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
