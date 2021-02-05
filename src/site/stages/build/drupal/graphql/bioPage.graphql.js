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

const GetNodePersonProfiles = `
  ${personProfileFragment}

  query GetNodePersonProfiles($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
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

module.exports = {
  fragment: personProfileFragment,
  GetNodePersonProfiles,
};
