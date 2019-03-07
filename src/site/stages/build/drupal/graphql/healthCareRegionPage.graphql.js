/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
const healthCareRegionHealthServices = require('./facilities-fragments/healthCareRegionHealthServices.node.graphql');

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
    ${healthCareLocalFacilities}
    newsStoryTeasers: reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "news_story"}
        { field: "status", value: "1"}
        { field: "field_featured" value: "1"}
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
        { field: "field_event_date", value: [$today], operator: GREATER_THAN}
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
            fieldLocationHumanreadable
            fieldFacilityLocation {
              entity {
                title
                entityUrl {
                  path
                }
              }
            }
          }
          
          entityUrl {
            path
          }
        }      
    }
    fieldClinicalHealthCareServi {
      processed
    }
    ${healthCareRegionHealthServices}
  }  
`;
