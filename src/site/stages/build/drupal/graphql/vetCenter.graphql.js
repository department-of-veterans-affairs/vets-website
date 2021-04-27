const {
  derivativeImage,
} = require('./paragraph-fragments/derivativeMedia.paragraph.graphql');
const { generatePaginatedQueries } = require('../individual-queries-helpers');

const draftContentOverride = process.env.UNPUBLISHED_CONTENT === 'true';

const vetCenterFragment = `
      fragment vetCenterFragment on NodeVetCenter {
        entityId
        entityUrl {
          path
          routed
        }
        entityBundle
        entityLabel
        fieldIntroText
        fieldFacilityLocatorApiId
        fieldVetCenterFeatureContent {
          targetId
          targetRevisionId
        }
        fieldCcVetCenterFeaturedCon {
          fetched
          fetchedBundle
        }
        fieldCcVetCenterFaqs {
          fetched
          fetchedBundle
        }
        fieldCcNonTraditionalHours {
          fetched
          fetchedBundle
        }
        fieldCcVetCenterCallCenter {
          fetched
          fetchedBundle
        }
        ${derivativeImage('_32MEDIUMTHUMBNAIL')}
        fieldPhoneNumber
        fieldAddress {
         countryCode
         locality
         postalCode
         administrativeArea
         addressLine1
        }   
        fieldOfficeHours {
          day
          starthours
          endhours
          comment
        }
        # Other locations link:
        reverseFieldOfficeNode(limit: 500, filter:{conditions: [{field: "type", value: ["vet_center_locations_list"]}]}) {
          entities {
            ... on NodeVetCenterLocationsList {
              entityUrl {
                path
                routed
              }
            }
          }
        }        
        fieldPrepareForVisit {
          entity {
            ... on ParagraphBasicAccordion {
              entityBundle
              entityId
              fieldHeader
              fieldRichWysiwyg {
                processed
              }
            }
          }
        }        
        fieldHealthServices {
          entity {
            ... on NodeVetCenterFacilityHealthServi {
              fieldServiceNameAndDescripti {
                entity {
                  ... on TaxonomyTermHealthCareServiceTaxonomy {
                    name
                    fieldVetCenterTypeOfCare
                    fieldServiceTypeOfCare
                    fieldVetCenterFriendlyName
                    fieldAlsoKnownAs
                    fieldVetCenterComConditions
                    fieldCommonlyTreatedCondition
                    fieldVetCenterServiceDescrip
                    description {
                      processed
                    }
                  }
                }
              }
            }
          }
        }
      }`;

const getVetCenterSlice = (operationName, offset, limit) => {
  return `
    ${vetCenterFragment}
    
    query GetVetCenters${
      !draftContentOverride ? '($onlyPublishedContent: Boolean!)' : ''
    } {
      nodeQuery(
        limit: ${limit}
        offset: ${offset}    
        filter: {
          conditions: [
            ${
              !draftContentOverride
                ? '{ field: "status", value: ["1"], enabled: $onlyPublishedContent },'
                : ''
            }     
            { field: "type", value: ["vet_center"] }
          ]
        }) {
        entities {
          ... vetCenterFragment
        }
      }
    }
`;
};

const getVetCenterQueries = entityCounts => {
  return generatePaginatedQueries({
    operationNamePrefix: 'GetVetCenter',
    entitiesPerSlice: 25,
    totalEntities: entityCounts.data.vetCenters.count,
    getSlice: getVetCenterSlice,
  });
};

module.exports = {
  fragment: vetCenterFragment,
  getVetCenterQueries,
};
