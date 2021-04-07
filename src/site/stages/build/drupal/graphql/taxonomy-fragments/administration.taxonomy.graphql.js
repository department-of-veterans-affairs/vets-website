/**
 * A Drupal entity reference field that references the administration taxonomy.
 * Appears on hub landing pages.
 */
// Get current feature flags

const fieldAministrationKey = 'FieldNodeLandingPageFieldAdministration';

module.exports = `
    fragment administration on NodeLandingPage {
        fieldAdministration {
        ... on ${fieldAministrationKey} {
          entity {
            ... on TaxonomyTermAdministration {
              name
              entityId
              entityBundle
              fieldDescription
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
