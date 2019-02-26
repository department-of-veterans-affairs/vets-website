/**
 * The top-level page for a health care region.
 * Example: /pittsburgh_health_care_system
 */

module.exports = `
  fragment pressRelease on NodePressRelease {
    entityId
    entityBundle
    entityPublished
    title
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
            title
            url
          }
        }
        
        ...on MediaVideo {
          vid
          fieldMediaVideoEmbedField
          fieldMediaInLibrary        
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
