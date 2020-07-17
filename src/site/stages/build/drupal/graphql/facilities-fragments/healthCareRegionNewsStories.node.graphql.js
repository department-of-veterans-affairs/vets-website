/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const NEWS_STORIES_RESULTS = `
  entities {
    entityId
    ... on NodeNewsStory {
      title
      fieldFeatured
      fieldIntroText
      fieldMedia {
        entity {
          ... on MediaImage {
            image {
              alt
              title
              derivative(style: _32MEDIUMTHUMBNAIL) {
                  url
                  width
                  height
              }
            }
          }
        }
      }
      entityUrl {
        path
      }
    }
  }
`;

function queryFilter(isAll) {
  return `
    reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "news_story"}
        { field: "status", value: "1"}
        ${isAll ? '' : '{ field: "field_featured" value: "1"}'}
      ]} sort: {field: "created", direction: DESC }, limit:${
        isAll ? '500' : '2'
      })
  `;
}

module.exports = `
  newsStoryTeasers: ${queryFilter(false)}
    {
    ${NEWS_STORIES_RESULTS}
  }
  allNewsStoryTeasers: ${queryFilter(true)}
    {
    ${NEWS_STORIES_RESULTS}
  }
`;
