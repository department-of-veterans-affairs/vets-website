/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
const healthCareRegionHealthServices = require('./facilities-fragments/healthCareRegionHealthServices.node.graphql');
const healthCareRegionNewsStories = require('./facilities-fragments/healthCareRegionNewsStories.node.graphql');
const healthCareRegionEvents = require('./facilities-fragments/healthCareRegionEvents.node.graphql');

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
    allPressReleaseTeasers: reverseFieldOfficeNode(filter: {
      conditions: [
        { field: "type", value: "press_release"}
        { field: "status", value: "1"}
      ]} sort: {field: "field_release_date", direction: DESC } limit: 100)
    {
      entities {
        ... on NodePressRelease {
          title
          entityUrl {
            path
          }
          fieldReleaseDate {
            value
          }
          fieldIntroText
        }
      }
    }
    ${healthCareLocalFacilities}    
    fieldIntroTextNewsStories {
      processed
    }
    ${healthCareRegionNewsStories}  
    fieldIntroTextEventsPage {
      processed
    }  
    ${healthCareRegionEvents}        
    fieldClinicalHealthCareServi {
      processed
    }
    ${healthCareRegionHealthServices}
  }  
`;
