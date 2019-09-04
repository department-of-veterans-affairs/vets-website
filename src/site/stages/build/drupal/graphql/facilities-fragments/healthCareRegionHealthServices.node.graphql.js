/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */
const { cmsFeatureFlags } = global;

const HEALTH_SERVICES_RESULTS = `
  entities {
    ... on NodeRegionalHealthCareServiceDes {
      entityId
      entityType
      fieldBody {
        processed
      }
      
      fieldLocalHealthCareService {
        entity {
          ...on NodeHealthCareLocalHealthService {
            fieldFacilityLocation {
              entity {
                ... on NodeHealthCareLocalFacility {
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
                  fieldNicknameForThisFacility
                }
              }
            }
          }
        }
      }
                          
      fieldServiceNameAndDescripti {
        entity {
          ... on TaxonomyTermHealthCareServiceTaxonomy {
            weight
            entityId
            entityBundle
            fieldAlsoKnownAs
            ${
              cmsFeatureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS
                ? 'fieldCommonlyTreatedCondition'
                : ''
            }
            name
            description {
              processed
            }
            parent {
              entity {
                ...on TaxonomyTermHealthCareServiceTaxonomy {
                  weight
                  name
                }
              }
            }            
            
          }
        }
      }        
    }
  }
`;

module.exports = `
  fieldClinicalHealthServices: queryFieldClinicalHealthServices(limit:100) {
    ${HEALTH_SERVICES_RESULTS}
  }
`;
