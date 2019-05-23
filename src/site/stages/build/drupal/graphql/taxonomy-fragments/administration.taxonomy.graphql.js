/**
 * A Drupal entity reference field that references the administration taxonomy.
 * Appears on hub landing pages.
 */

// Get current feature flags
let pageAdministration;
const {
  featureFlags,
  enabledFeatureFlags,
} = require('./../../../../../utilities/featureFlags');

if (enabledFeatureFlags[featureFlags.GRAPHQL_MODULE_UPDATE]) {
  pageAdministration = 'FieldNodeLandingPageFieldAdministration';
} else {
  pageAdministration = 'FieldNodeAdministration';
}

module.exports = `
    fragment administration on NodeLandingPage {
        fieldAdministration {
        ... on ${pageAdministration} {
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
