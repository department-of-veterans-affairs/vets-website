const entityElementsFromPages = require('./entityElementsForPages.graphql');

const { enabledFeatureFlags } = global;
const socialMediaFields = enabledFeatureFlags.FEATURE_LOCAL_FACILITY_GET_IN_TOUCH
  ? require('./facilities-fragments/healthCareSocialMedia.fields.graphql')
  : '';

module.exports = `
  fragment healthCareLocalFacilityPage on NodeHealthCareLocalFacility {
    ${entityElementsFromPages}
    changed
    fieldFacilityLocatorApiId
    fieldNicknameForThisFacility
    fieldIntroText
    ${
      enabledFeatureFlags.FEATURE_FIELD_OPERATING_STATUS_FACILITY
        ? 'fieldOperatingStatusFacility'
        : ''
    }
    fieldLocationServices {
      entity {
        ... on ParagraphHealthCareLocalFacilityServi {
          entityId
          entityBundle
          fieldTitle
          fieldWysiwyg {
            processed
          }
        }
      }
    }
    fieldMainLocation
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: CROP_3_2) {
                url
                width
                height
            }
          }
        }
      }
    }
    ${socialMediaFields}
    fieldLocalHealthCareService {
      entity {
        ... on NodeHealthCareLocalHealthService {
          fieldBody {
            processed
          }
          ${
            enabledFeatureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE
              ? 'fieldRegionalHealthService'
              : 'fieldClinicalHealthServices'
          } {
            entity {
              ... on NodeRegionalHealthCareServiceDes {
                entityBundle
                fieldBody {
                  processed
                }
                fieldServiceNameAndDescripti {
                  entity {
                    ... on TaxonomyTermHealthCareServiceTaxonomy {                    
                      entityId
                      entityBundle
                      fieldAlsoKnownAs
                      ${
                        enabledFeatureFlags.FEATURE_FIELD_COMMONLY_TREATED_CONDITIONS
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
                      ${
                        enabledFeatureFlags.FEATURE_HEALTH_SERVICE_API_ID
                          ? 'fieldHealthServiceApiId'
                          : ''
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
