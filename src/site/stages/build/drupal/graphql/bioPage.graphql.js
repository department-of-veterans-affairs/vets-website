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

function getNodePersonProfilesSlices(operationName, offset, limit = 100) {
  return `
    ${personProfileFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
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
      100,
    ),
    GetNodePersonProfileSlice3: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice3',
      200,
    ),
    GetNodePersonProfileSlice4: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice4',
      300,
    ),
    GetNodePersonProfileSlice5: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice5',
      400,
    ),
    GetNodePersonProfileSlice6: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice6',
      500,
    ),
    GetNodePersonProfileSlice7: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice7',
      600,
    ),
    GetNodePersonProfileSlice8: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice8',
      700,
    ),
    GetNodePersonProfileSlice9: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice9',
      800,
    ),
    GetNodePersonProfileSlice10: getNodePersonProfilesSlices(
      'GetNodePersonProfileSlice10',
      900,
      9999,
    ),
  },
};
