const { FIELD_PROMO } = require('./block-fragments/promo.block.graphql');
const { FIELD_RELATED_LINKS } = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
/**
 * The top-level page for a section of the website.
 * Examples include /health-care/, /disability/, etc.
 */
module.exports = `
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
    ${FIELD_RELATED_LINKS}
    fieldSpokes {
      ...listOfLinkTeasers
    }
  }
`;
