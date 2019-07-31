/**
 * Associated person profiles on the healthcare region node
 */

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
