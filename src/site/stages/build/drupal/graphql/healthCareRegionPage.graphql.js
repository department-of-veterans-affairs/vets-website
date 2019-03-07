/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */
const healthCareLocalFacilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
const healthCarePatientFamilyServices = require('./facilities-fragments/healthCarePatientFamilyServices.node.graphql');
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
    fieldPatientFamilyServicesIn {
        processed
    }
    ${healthCarePatientFamilyServices}
    ${healthCareLocalFacilities}
    fieldClinicalHealthCareServi {
      processed
    }
    ${healthCareRegionHealthServices}
  }  
`;
