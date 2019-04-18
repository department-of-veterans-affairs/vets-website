/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

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
    filter: {conditions: [{field: "field_service_name_and_descripti.entity.parent.entity.name", value: "${type}", operator: EQUAL}]}, sort: {field: "field_service_name_and_descripti.entity.name", direction: ASC}
  `;
}

module.exports = `
  specialtyCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Specialty care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  primaryCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Primary care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  mentalHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'Mental health',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  careCoordinatorPatientFamilyServices: queryFieldClinicalHealthServices(${queryFilter(
    'Care coordinators',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
    }
  socialProgramsPatientFamilyServices: queryFieldClinicalHealthServices(${queryFilter(
    'Social programs and services',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
    }
  healthWellnessPatientFamilyServices: queryFieldClinicalHealthServices(${queryFilter(
    'Health and wellness',
  )}) {
      ${HEALTH_SERVICES_RESULTS}
    }
`;
