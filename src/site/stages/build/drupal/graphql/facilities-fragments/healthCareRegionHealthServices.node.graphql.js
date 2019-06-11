/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../../utilities/featureFlags');

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
            entityId
            entityBundle
            fieldAlsoKnownAs
            ${
              enabledFeatureFlags[
                featureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS
              ]
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

function queryFilter(type) {
  return `
    filter: {conditions: [{field: "field_service_name_and_descripti.entity.parent.entity.name", value: "${type}", operator: EQUAL}]}
  `;
}

module.exports = `
  featuredHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Featured services',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  primaryCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Primary care (Family medicine, internal medicine)',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  extendedCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Extended care and rehabilitation',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
  }
  homelessHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Homeless services',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
  }
  socialProgramsPatientFamilyServices: queryFieldClinicalHealthServices(${queryFilter(
    'Social programs and services',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
  }
  genomicMedicineHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Genomic medicine/medical genetics (Genetic medicine)',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
  }
  healthWellnessPatientFamilyServices: queryFieldClinicalHealthServices(${queryFilter(
    'Health and wellness',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
  }
  mentalHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Mental and behavioral health',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  specialtyCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Specialty care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  veteranCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Services for Veteran care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
`;
