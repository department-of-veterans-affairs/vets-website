/**
 * The alerts that appear above content.
 */

module.exports = `
    alerts:   blockContentQuery(filter: {conditions: [{field: "type", value: "alert"}, {field: "status", value: "1"}]},
    sort: {field: "field_alert_scope", direction: DESC}
    limit: 100) {
    entities {
      ... on BlockContentAlert {
        id
        fieldAlertFrequency
        fieldAlertScope {
          targetId
        }
        fieldAlertType
        fieldAlertTitle
        fieldAlertContent {
          entity {
            entityRendered
          }
        }
      }
    }
  }
`;
