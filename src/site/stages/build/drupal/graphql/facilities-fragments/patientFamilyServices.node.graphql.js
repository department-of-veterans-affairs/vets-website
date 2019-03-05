/**
 * A Drupal node that stores a list of a health care region's patient and family services
 *
 */

module.exports = `
    fragment patientFamilyServices on NodeHealthCareRegionPage {
      fieldPatientFamilyServices {
        entity {
          ... on NodeRegionalHealthCareServiceDes {
            entityUrl {
              path
            }
            entityBundle
            entityId
            title
            changed
            fieldBody {
              processed
            }
            fieldServiceLocation {
              entity {
                ... on NodeHealthCareLocalFacility {
                  fieldNicknameForThisFacility
                  fieldFacilityLocatorApiId
                }
              }
            }
            fieldServiceNameAndDescripti {
              entity {
                ... on TaxonomyTermHealthCareServiceTaxonomy {
                  fieldServiceTypeNonclinical
                  fieldAlsoKnownAs
                  description {
                    processed
                  }
                  entityLabel
                  entityId
                }
              }
            }
          }
        }
      }
    }
`;
