const entityElementsFromPages = require('./entityElementsForPages.graphql');
const socialMediaFields = require('./facilities-fragments/healthCareSocialMedia.fields.graphql');
const serviceLocation = require('./paragraph-fragments/serviceLocation.paragraph.graphql');
const appointmentItems = require('./file-fragments/appointmentItems.graphql');

module.exports = `
  fragment healthCareLocalFacilityPage on NodeHealthCareLocalFacility {
    ${entityElementsFromPages}
    changed
    fieldFacilityLocatorApiId
    fieldNicknameForThisFacility
    title
    fieldIntroText
    fieldOperatingStatusFacility
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
    fieldAddress {
      addressLine1
      locality
      administrativeArea
      postalCode
    }
    fieldPhoneNumber
    fieldMentalHealthPhone
    fieldFacilityHours {
      value
    }
    fieldMainLocation
    fieldMedia {
      entity {
        ... on MediaImage {
          image {
            alt
            title
            derivative(style: _32MEDIUMTHUMBNAIL) {
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
          fieldRelatedLinks {
            entity {
              ... listOfLinkTeasers
            }
          }
          fieldGovdeliveryIdEmerg
          fieldGovdeliveryIdNews
          fieldOperatingStatus {
            url {
              path
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
          ${serviceLocation}
          ${appointmentItems}
          fieldRegionalHealthService
          {
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
                      fieldCommonlyTreatedCondition
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
                      fieldHealthServiceApiId
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
