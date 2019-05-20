/**
 * A Drupal entity reference field that references the administration taxonomy.
 * Appears on hub landing pages.
 */

module.exports = `
    fragment administration on NodeLandingPage {
        fieldAdministration {
        ... on FieldNodeFieldAdministration {
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
