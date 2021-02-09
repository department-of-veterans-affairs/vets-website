/**
 * A person profile detail page
 *
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');

const personProfileFragment = `
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
          title
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
          derivative(style: _23MEDIUMTHUMBNAIL) {
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

function getNodePersonProfilesSlices(operationName, offset, limit = 50) {
  return `
    ${personProfileFragment}

    query GetNodePersonProfiles($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "changed", direction:  ASC }
        filter: {
          conditions: [
            { field: "status", value: ["1"], enabled: $onlyPublishedContent },
            { field: "type", value: ["person_profile"] }
          ]
      }) {
        entities {
          ... bioPage
        }
      }
    }
`;
}

module.exports = {
  fragment: personProfileFragment,
  NodePersonProfilesSlices: {
    GetNodePersonProfileSlice1: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice1',
      0,
    ),
    GetNodePersonProfileSlice2: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice2',
      50,
    ),
    GetNodePersonProfileSlice3: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice3',
      100,
      9999,
    ),
  },
};
