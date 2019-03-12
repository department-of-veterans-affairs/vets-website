/**
 * Associated person profiles on the healthcare region node
 */

const PERSON_PROFILE_RESULTS = `
  entities {
    ... on NodePersonProfile {
      fieldNameFirst
      fieldLastName
      fieldSuffix
      fieldDescription
      fieldIntroText
      fieldPhotoAllowHiresDownload
      fieldMedia {
        entity {
          ... on MediaImage {
            image {
              alt
              title
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
    sort: {field: "changed", direction: DESC } 
    limit:${isAll ? '500' : '10'})
  `;
}

module.exports = `
  allStaffProfiles: ${queryFilter(true)}
    {
    ${PERSON_PROFILE_RESULTS}
  }
`;
