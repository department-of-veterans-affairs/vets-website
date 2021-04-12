const {
  derivativeImage,
} = require('./paragraph-fragments/derivativeMedia.paragraph.graphql');

const draftContentOverride = process.env.UNPUBLISHED_CONTENT === 'true';

const vetCenterLocationsFragment = `
fragment vetCenterLocationsFragment on NodeVetCenterLocationsList {
  entityId
  entityUrl {
    path
    routed
  }
  entityBundle
  entityLabel
  fieldIntroText
  fieldNearbyVetCenters {
    entity {
      ... on NodeVetCenter {
        entityBundle
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }        
        fieldPhoneNumber
        ${derivativeImage('_32MEDIUMTHUMBNAIL')}                           
      }          
      ... on NodeVetCenterOutstation {
        entityBundle
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }
        fieldPhoneNumber
        ${derivativeImage('_32MEDIUMTHUMBNAIL')}             
      }
      ... on NodeVetCenterCap {
        entityBundle
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }        
        ${derivativeImage('_32MEDIUMTHUMBNAIL')}                           
      }
      ... on NodeVetCenterMobileVetCenter {
        entityBundle              
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }      
        fieldPhoneNumber
        ${derivativeImage('_32MEDIUMTHUMBNAIL')}                            
      }              
    } 
  }
  fieldOffice {
    entity {
      ... on NodeVetCenter {
        reverseFieldOfficeNode(limit: 500, filter: {conditions: [{field: "type", value: ["vet_center_outstation", "vet_center_cap", "vet_center_mobile_vet_center"]}]}) {
          entities {
            ... on NodeVetCenterCap {
              title
              entityBundle
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
              fieldAddress {
                locality
                administrativeArea
                postalCode
                addressLine1
              }
            }
            ... on NodeVetCenterOutstation {
              title
              entityBundle
              fieldOperatingStatusFacility
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
              fieldAddress {
                locality
                administrativeArea
                postalCode
                addressLine1
              }
              fieldPhoneNumber              
            }
            ... on NodeVetCenterMobileVetCenter {
              title
              entityBundle
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
              fieldAddress {
                locality
                administrativeArea
                postalCode
                addressLine1
              }
              fieldPhoneNumber              
            }
          }
        }
        title
        fieldAddress {
          countryCode
          locality
          postalCode
          addressLine1
        }
        fieldPhoneNumber
        fieldOperatingStatusFacility
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
      }
    }
  }
}`;

const GetVetCenterLocations = `
  ${vetCenterLocationsFragment}
  
  query GetVetCenterLocations${
    !draftContentOverride ? '($onlyPublishedContent: Boolean!)' : ''
  } {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        ${
          !draftContentOverride
            ? '{ field: "status", value: ["1"], enabled: $onlyPublishedContent },'
            : ''
        }
        { field: "type", value: ["vet_center_locations_list"] }
      ]
    }) {
      entities {
        ... vetCenterLocationsFragment
      }
    }
  }
`;

module.exports = {
  fragment: vetCenterLocationsFragment,
  GetVetCenterLocations,
};
