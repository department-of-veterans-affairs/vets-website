/**
 * The Menu Item Extras module allows us to add fields to menu items in Drupal
 * and exposes a query whereby we can request menu items with their associated fields.
 *
 */

const headerQuery = require('./header.nav.graphql');

module.exports = `
  menuLinkContentQuery(limit: 1000, filter: {conditions: [{field: "enabled", value: "1"}]}) {
    entities {
      entityId
      entityLabel
      ${headerQuery}
    }
  }
`;
