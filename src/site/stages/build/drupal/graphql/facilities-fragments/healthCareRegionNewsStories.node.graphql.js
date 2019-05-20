/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const NEWS_STORIES_RESULTS = `
  entities {
    ... on NodeNewsStory {
      title
      fieldIntroText
      fieldMedia {
        entity {
          ... on MediaImage {
            image {
              alt
              title
              derivative(style: CROP_3_2) {
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
      ]} sort: {field: "changed", direction: DESC } limit:${
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
