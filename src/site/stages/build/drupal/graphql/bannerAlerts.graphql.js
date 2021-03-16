/**
 * The alerts that appear above content.
 */

const bannerAlerts = `
  bannerAlerts: nodeQuery(limit: 500, filter: {conditions: [{field: "status", value: "1", operator: EQUAL}, {field: "type", value: "full_width_banner_alert"}]}) {
    entities {
      ... on NodeFullWidthBannerAlert {
        title
        fieldBody {
          processed
        }
        entityId
        fieldAlertType
        fieldAlertDismissable
        fieldAlertFindFacilitiesCta
        fieldAlertOperatingStatusCta
        fieldAlertEmailUpdatesButton
        fieldAlertInheritanceSubpages
        fieldAdministration {
          entity {
            entityId
          }
        }
        fieldOperatingStatusSendemail
        fieldBannerAlertSituationinfo {
          processed
        }
        fieldSituationUpdates {
          entity {
            ... on ParagraphSituationUpdate {
              fieldWysiwyg {
                processed
              }
            }
          }
        }
        fieldBannerAlertVamcs {
          entity {
            ... on NodeVamcOperatingStatusAndAlerts {
              title
              entityUrl {
                path
              }
              fieldOffice {
                entity {
                  ... on NodeHealthCareRegionPage {
                    title
                    entityUrl {
                      path
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

const GetBannnerAlerts = `
  query {
    ${bannerAlerts}
  }
`;

module.exports = {
  partialQuery: bannerAlerts,
  GetBannnerAlerts,
};
