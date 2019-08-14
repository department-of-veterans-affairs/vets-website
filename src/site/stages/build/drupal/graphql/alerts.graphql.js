/**
 * The alerts that appear above content.
 */

// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('../../../../utilities/featureFlags');

module.exports = `
    alerts:   blockContentQuery(filter: {conditions: [{field: "type", value: "alert"}, {field: "status", value: "1"}]},
    sort: {field: "field_node_reference", direction: DESC}
    limit: 100) {
    entities {
      ... on BlockContentAlert {
        id
      ${
        enabledFeatureFlags[featureFlags.FEATURE_FIELD_ALERT_DISMISSABLE]
          ? 'fieldAlertDismissable'
          : ''
      }
        fieldAlertFrequency
        fieldNodeReference {
          targetId
        }
        fieldIsThisAHeaderAlert
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
