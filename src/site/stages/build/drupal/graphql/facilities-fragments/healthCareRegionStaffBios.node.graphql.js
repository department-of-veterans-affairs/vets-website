/**
 * Associated person profiles on the healthcare region node
 */

const PERSON_PROFILE_RESULTS = `
  entities {
    ... on NodePersonProfile {
      entityPublished
      title
      fieldNameFirst
      fieldLastName
      fieldSuffix
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
              derivative(style: _1_1_SQUARE_MEDIUM_THUMBNAIL) {
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

function queryFilter(isAll) {
  return `
    reverseFieldOfficeNode(
    filter: {
      conditions: [
        { field: "type", value: "person_profile"}
        { field: "status", value: "1"}
      ]
    } 
    sort: {field: "field_office", direction: DESC }
    limit:${isAll ? '500' : '10'})
  `;
}

module.exports = `
  allStaffProfiles: ${queryFilter(true)}
    {
    ${PERSON_PROFILE_RESULTS}
  }
`;
