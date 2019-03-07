/**
 * The 'Health Care Local Facility' bundle of the 'Content' entity type.
 */

const HEALTH_SERVICES_RESULTS = `
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
    filter: {conditions: [{field: "field_service_name_and_descripti.entity.field_service_type_clinical", value: "${type}", operator: EQUAL}]}, sort: {field: "field_service_name_and_descripti.entity.name", direction: ASC}
  `;
}

module.exports = `
  specialtyCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'specialty_care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  primaryCareHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'primary_care',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
  mentalHealthServices: queryFieldClinicalHealthServices(${queryFilter(
    'mental_health',
  )}) {
    ${HEALTH_SERVICES_RESULTS}
  }
`;
