/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
const healthCareRegionHealthServices = require('./facilities-fragments/healthCareRegionHealthServices.node.graphql');
const healthCareRegionNewsStories = require('./facilities-fragments/healthCareRegionNewsStories.node.graphql');
const healthCareRegionEvents = require('./facilities-fragments/healthCareRegionEvents.node.graphql');
const healthCareStaffBios = require('./facilities-fragments/healthCareRegionStaffBios.node.graphql');
const healthCareRegionDetailPage = require('./facilities-fragments/healthCareRegionDetailPage.node.graphql');

module.exports = `
  fragment healthCareRegionPage on NodeHealthCareRegionPage {
    ${entityElementsFromPages}
    entityId
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
    fieldFacebook {
      url {
        path
      }
      title
    }
    fieldTwitter {
      url {
        path
      }
      title
    }
    fieldFlickr {
      url {
        path
      }
        title
    }
    fieldInstagram {
      url {
        path
      }
      title
    }
    fieldEmailSubscription {
      url {
        path
      }
      title
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
    ${healthCareStaffBios}
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
    ${healthCareRegionDetailPage}
    fieldPressReleaseBlurb {
      processed
    }
  }
`;
