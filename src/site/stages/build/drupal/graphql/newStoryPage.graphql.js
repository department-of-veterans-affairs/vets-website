const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { generatePaginatedQueries } = require('../individual-queries-helpers');

const newsStoryFragment = `
  fragment newsStoryPage on NodeNewsStory {
    ${entityElementsFromPages}
    promote
    created
    fieldAuthor {
      entity {
        ...on NodePersonProfile {
          title
          fieldDescription
        }
      }
    }
    fieldImageCaption
    fieldIntroText
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: _21MEDIUMTHUMBNAIL) {
              url
              width
              height
            }
          }
        }
      }
    }
    fieldListing {
      entity {
        entityUrl {
          path
        }
      }
    }
    fieldFullStory {
      processed
    }
  }
`;

const getNewsStorySlice = (operationName, offset, limit) => {
  return `
    ${newsStoryFragment}

    query GetNodeNewsStoryPages($onlyPublishedContent: Boolean!) {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}
        filter: {
        conditions: [
          { field: "status", value: ["1"], enabled: $onlyPublishedContent },
          { field: "type", value: ["news_story"] }
        ]
      }) {
        entities {
          ... newsStoryPage
        }
      }
    }
  `;
};

const getNewsStoryQueries = entityCounts => {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetNewsStory',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.newsStories.count,
    getSlice: getNewsStorySlice,
  });
};

module.exports = {
  fragment: newsStoryFragment,
  getNewsStoryQueries,
};
