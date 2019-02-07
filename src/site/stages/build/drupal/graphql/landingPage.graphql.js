const { FIELD_PROMO } = require('./block-fragments/promo.block.graphql');
const administration = require('./taxonomy-fragments/administration.taxonomy.graphql');

/**
 * The top-level page for a section of the website.
 * Examples include /health-care/, /disability/, etc.
 */
const ADMIN = '...administration';

module.exports = `
  ${administration}
  
  fragment landingPage on NodeLandingPage {
    entityUrl {
      ... on EntityCanonicalUrl {
        breadcrumb {
          url {
            path
            routed
          }
          text
        }
        path
      }
    }
    entityBundle
    entityPublished
    title
    fieldIntroText
    ${FIELD_PROMO}
    ${ADMIN}
  }
`;
