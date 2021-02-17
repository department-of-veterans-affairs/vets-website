/**
 * A person profile detail page
 *
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { generatePaginatedQueries } = require('../individual-queries-helpers');

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

function getNodePersonProfilesSlice(operationName, offset, limit) {
  return `
    ${personProfileFragment}

    query ${operationName}($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        sort: { field: "nid", direction:  ASC }
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

function getNodePersonProfileQueries(entityCounts) {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNodePersonProfile',
    entitiesPerSlice: 50,
    totalEntities: entityCounts.data.personProfile.count,
    getSlice: getNodePersonProfilesSlice,
  });
}

module.exports = {
  fragment: personProfileFragment,
  getNodePersonProfileQueries,
};
