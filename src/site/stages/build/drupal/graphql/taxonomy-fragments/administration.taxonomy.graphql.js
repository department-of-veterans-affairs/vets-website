/**
 * A Drupal entity reference field that references the administration taxonomy.
 * Appears on hub landing pages.
 */
// Get current feature flags
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../../utilities/featureFlags');

let fieldAministrationKey;
if (enabledFeatureFlags[featureFlags.GRAPHQL_MODULE_UPDATE]) {
  fieldAministrationKey = 'FieldNodeLandingPageFieldAdministration';
} else {
  fieldAministrationKey = 'FieldNodeFieldAdministration';
}

module.exports = `
    fragment administration on NodeLandingPage {
        fieldAdministration {
        ... on ${fieldAministrationKey} {
          entity {
            ... on TaxonomyTermAdministration {
              name
              entityId
              entityBundle
              fieldIntroText
              fieldDescription
              fieldAcronym
              fieldLink {
                url {
                  path
                }
              }
              fieldEmailUpdatesUrl
              fieldEmailUpdatesLinkText
              fieldSocialMediaLinks {
                platformValues
                value
                platform
              }
            }
          }
        }
      }
    }
`;
