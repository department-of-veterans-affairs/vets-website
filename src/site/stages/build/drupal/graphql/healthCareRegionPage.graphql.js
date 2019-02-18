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
    fieldMedia {
      entity {
        ... on MediaImage {
            image {
              alt
              title
              derivative(style: CROP_7_2) {
                  url
                  width
                  height
              }
            }
          }
      }
    }
    fieldIntroText
	  fieldRelatedLinks {
      entity {
      	... listOfLinkTeasers
      }
    }
    mainLocalFacilities: reverseFieldRegionPageNode(filter: {
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
    newsStoryTeasers: reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "news_story"}
        { field: "status", value: "1"}
      ]} sort: {field: "changed", direction: DESC } limit: 2)
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
    }
    eventTeasers: reverseFieldOfficeNode (filter: {
      conditions: [
        { field: "type", value: "event"}
        { field: "status", value: "1"}
        { field: "field_event_date", value: "2018-02-18", operator: GREATER_THAN}
      ]} sort: {field: "field_event_date", direction: ASC } limit: 2)
      {
        entities {
          ... on NodeEvent {
            title
            fieldEventDate {
              value
            }
            fieldEventDateEnd {
              value
            }
            fieldDescription
          }
          entityUrl {
            path
          }
        }      
    }
  }
`;
