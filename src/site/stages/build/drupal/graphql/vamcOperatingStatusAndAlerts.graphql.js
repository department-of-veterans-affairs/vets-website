const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment vamcOperatingStatusAndAlerts on NodeVamcOperatingStatusAndAlerts {
    ${entityElementsFromPages}
    title
    nid
    fieldOffice {
      entity {
        ... on NodeHealthCareRegionPage {
          fieldLinkFacilityEmergList {
            url {
              path
              routed
            }
          }
        }
      }
    }
    fieldLinks {
      uri
      title
    }
    fieldOperatingStatusEmergInf {
      value
    }
    fieldFacilityOperatingStatus {
      entity {
        ... on NodeHealthCareLocalFacility {
          title
          entityUrl {
            path
            routed
          }
          fieldOperatingStatusFacility
          fieldOperatingStatusMoreInfo
        }
      }
    }
    fieldBannerAlert {
      entity {
        ... on NodeFullWidthBannerAlert {
          title
          fieldBannerAlertSituationinfo {
            processed
          }
          fieldSituationUpdates {
            entity {
              ... on ParagraphSituationUpdate {
                fieldDateAndTime {
                  date
                  value
                }
                fieldWysiwyg {
                  processed
                }
              }
            }
          }
          fieldBody {
            processed
          }
        }
      }
    }
  }
`;
