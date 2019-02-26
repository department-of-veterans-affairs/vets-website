/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

module.exports = `
  fragment pressReleasePage on NodePressRelease {
    entityId
    entityBundle
    entityPublished
    title
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
    fieldReleaseDate {
      value
      date
    }
    fieldPdfVersion {
      entity {
        ...on MediaDocument {
          fieldDocument {
            entity {
              ...on File {
                filename
                url         
              }
            }
          }
        }      
      }
    }
    fieldAddress {
      locality
      administrativeArea
    }
    fieldIntroText
    fieldPressReleaseFulltext {
      processed
    }
    fieldPressReleaseContact {
      entity {
        ...on NodePersonProfile {
          title
          fieldDescription
          fieldPhoneNumber
          fieldEmailAddress
        }
      }
    }
    fieldPressReleaseDownloads {
      entity {
        entityId
        entityBundle
        name
        ...on MediaDocument {
          fieldDocument {
            entity {
              ...on File {
                filename
                url          
              }
            }
          }
        }   
        
        ...on MediaImage {        
          image {          
            alt
            url
          }
        }
        
        ...on MediaVideo {
          fieldMediaVideoEmbedField        
        }
        
      }
    }
    fieldOffice {
      entity {
        ...on NodeHealthCareRegionPage {
          fieldPressReleaseBlurb {
            processed
          }
        }
      }
    }  
  }
`;
