const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const facilities = require('./facilities-fragments/healthCareLocalFacility.node.graphql');
/**
 * The 'Health Care Region page' bundle of the 'Content' entity type.
 */

module.exports = `
fragment healthCareRegionPage on NodeHealthCareRegionPage {
  entityId
  entityBundle
  entityPublished
  title
  fieldIntroText
  changed
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
  fieldLocationsIntroBlurb {
    processed
  }
  fieldPatientFamilyServicesIn {
    processed
  }
  ${FIELD_RELATED_LINKS}     
  fieldPatientFamilyServices {
    entity {
      ... on NodeRegionalHealthCareServiceDes {
        body {                
          processed
          summary
          summaryProcessed                
        }
        fieldServiceLocation {
          entity {
            entityBundle
            entityId
            ... on NodeHealthCareLocalFacility {
              entityId
              entityBundle
              fieldIntroText
              fieldFacilityLocatorApiId
              fieldNicknameForThisFacility
              fieldMainLocation
              fieldLocationServices {
                entity {
                  ... on ParagraphHealthCareLocalFacilityServi {
                    fieldTitle
                    fieldWysiwyg {
                      processed
                    }
                    entityBundle
                    entityId
                  }
                }
              }
            }
          }
        }
        fieldServiceNameAndDescripti {
          entity {
            ...on TaxonomyTermHealthCareServiceTaxonomy {
              fieldServiceTypeClinical
              fieldServiceTypeNonclinical
              entityId
              entityBundle                    
            }
          }
        }              
      }
    }
  }
  fieldClinicalHealthCareServi {
    processed
  }
  fieldClinicalHealthServices {
    entity {
      ... on NodeRegionalHealthCareServiceDes {
        body {                
          processed
          summary
          summaryProcessed                
        }
        fieldServiceLocation {
          entity {
            entityBundle
            entityId
            ... on NodeHealthCareLocalFacility {
              entityId
              entityBundle
              fieldIntroText
              fieldFacilityLocatorApiId
              fieldNicknameForThisFacility
              fieldMainLocation
              fieldLocationServices {
                entity {
                  ... on ParagraphHealthCareLocalFacilityServi {
                    fieldTitle
                    fieldWysiwyg {
                      processed
                    }
                    entityBundle
                    entityId
                  }
                }
              }
            }
          }
        }
        fieldServiceNameAndDescripti {
          entity {
            ...on TaxonomyTermHealthCareServiceTaxonomy {
              fieldServiceTypeClinical
              fieldServiceTypeNonclinical
              entityId
              entityBundle                    
            }
          }
        }              
      }
    }
  }
  ${facilities}
}

`;
