const entityElementsFromPages = require('./entityElementsForPages.graphql');

const vamcOperatingStatusAndAlerts = `
  fragment vamcOperatingStatusAndAlerts on NodeVamcOperatingStatusAndAlerts {
    ${entityElementsFromPages}
    title
    nid
    fieldOffice {
      entity {
        ... on NodeHealthCareRegionPage {
          entityLabel
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
          status
          title
          fieldBannerAlertSituationinfo {
            processed
          }
          fieldSituationUpdates {
            entity {
              entityId
              ... on ParagraphSituationUpdate {
                fieldDatetimeRangeTimezone {
                  value
                  startTime
                  endValue
                  endTime
                  timezone
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

const GetNodeVamcOperatingStatusAndAlerts = `

  ${vamcOperatingStatusAndAlerts}

  query GetNodeVamcOperatingStatusAndAlerts($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 500, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["vamc_operating_status_and_alerts"] }
      ]
    }) {
      entities {
        ... vamcOperatingStatusAndAlerts
      }
    }
  }
`;

module.exports = {
  fragment: vamcOperatingStatusAndAlerts,
  GetNodeVamcOperatingStatusAndAlerts,
};
