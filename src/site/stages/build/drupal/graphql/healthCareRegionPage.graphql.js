/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

module.exports = `
  fragment healthCareRegionPage on NodeHealthCareRegionPage {
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
    entityId
    entityBundle
    entityPublished
    title
    fieldIntroText
	  fieldRelatedLinks {
      entity {
      	... listOfLinkTeasers
      }
    }
    localFacilities: reverseFieldRegionPageNode(filter: {
      conditions: [
        { field: "type", value: "health_care_local_facility"}
        { field: "field_main_location", value: "1"}
        { field: "status", value: "1"}
      ]
    }, sort: {field: "title", direction: ASC} ) {
      entities {
        ... on NodeHealthCareLocalFacility {
          title
          fieldFacilityLocatorApiId
        }
      }
    }
    newsStories: reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "news_story"}
        { field: "status", value: "1"}
      ]}, limit: 2) 
      {
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
                  derivative(style: CROP_2_1) {
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
    }
  }
`;
