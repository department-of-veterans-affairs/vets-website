const onlyPublishedContent = process.env.UNPUBLISHED_CONTENT ? 'false' : 'true';

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
      ... on NodeVetCenterOutstation {
        entityBundle
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }
        fieldPhoneNumber
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
      ... on NodeVetCenterCap {
        entityBundle
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }        
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
      ... on NodeVetCenterMobileVetCenter {
        entityBundle              
        fieldAddress {
          locality
          administrativeArea
          postalCode
          addressLine1
        }      
        fieldPhoneNumber
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
        fieldAddress {
          countryCode
          locality
          postalCode
          addressLine1
        }
        fieldPhoneNumber
      }
    }
  }
}`;

const GetVetCenterLocations = `
  ${vetCenterLocationsFragment}
  
  query GetVetCenterLocations {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: ${onlyPublishedContent} },
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
