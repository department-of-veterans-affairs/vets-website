const entityElementsFromPages = require('./entityElementsForPages.graphql');
const {
  featureFlags,
  enabledFeatureFlags,
} = require('../../../../utilities/featureFlags');
const socialMediaFields = enabledFeatureFlags[
  featureFlags.FEATURE_LOCAL_FACILITY_GET_IN_TOUCH
]
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
      enabledFeatureFlags[featureFlags.FEATURE_FIELD_OPERATING_STATUS_FACILITY]
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
    fieldRegionPage {
      entity {
        ... on NodeHealthCareRegionPage {
          entityBundle
          entityId
          entityPublished
          title
          fieldNicknameForThisFacility
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
            enabledFeatureFlags[
              featureFlags.FEATURE_FIELD_REGIONAL_HEALTH_SERVICE
            ]
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
                      ${
                        enabledFeatureFlags[
                          featureFlags.FEATURE_HEALTH_SERVICE_API_ID
                        ]
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
