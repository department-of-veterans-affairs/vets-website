/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const PATIENT_FAMILY_SERVICES_RESULTS = `
  entities {      
    ... on NodeRegionalHealthCareServiceDes {
      status
      fieldBody {
        processed
      }
      fieldServiceLocation: queryFieldServiceLocation(filter: {conditions: [{field: "status", value: "1", operator: EQUAL}]}, sort: {field: "field_nickname_for_this_facility", direction: ASC}) {
        entities {
          entityBundle
          entityId
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
      fieldServiceNameAndDescripti {
        entity {
          ... on TaxonomyTermHealthCareServiceTaxonomy {
            fieldServiceTypeClinical
            fieldServiceTypeNonclinical
            entityId
            entityBundle
            fieldAlsoKnownAs
            name
            description {
              processed
            }
          }
        }
      }
    }
  }
`;

function queryFilter(type) {
  return `
    filter: {conditions: [{field: "field_service_name_and_descripti.entity.field_service_type_nonclinical", value: "${type}", operator: EQUAL}]}, sort: {field: "field_service_name_and_descripti.entity.name", direction: ASC}
  `;
}

module.exports = `
  careCoordinatorPatientFamilyServices: queryFieldPatientFamilyServices(${queryFilter(
    'care_coordinator',
  )}) {
    ${PATIENT_FAMILY_SERVICES_RESULTS}
  }
  socialProgramsPatientFamilyServices: queryFieldPatientFamilyServices(${queryFilter(
    'social_programs_and_services',
  )}) {
    ${PATIENT_FAMILY_SERVICES_RESULTS}
  }
  healthWellnessPatientFamilyServices: queryFieldPatientFamilyServices(${queryFilter(
    'health_and_wellness',
  )}) {
    ${PATIENT_FAMILY_SERVICES_RESULTS}
  }
`;
