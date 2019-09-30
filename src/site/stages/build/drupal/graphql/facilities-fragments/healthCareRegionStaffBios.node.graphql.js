/**
 * Associated person profiles on the healthcare region node
 */
const { cmsFeatureFlags } = global;

const PERSON_PROFILE_RESULTS = `
  entity {
    ... on NodePersonProfile {
      entityPublished
      title
      fieldNameFirst
      fieldLastName
      fieldSuffix
      fieldEmailAddress
      fieldPhoneNumber
      fieldDescription
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
      entityUrl {
        path
      }
    }
  }
`;

module.exports = `
  fieldLeadership
    {
    ${PERSON_PROFILE_RESULTS}
  }
`;
