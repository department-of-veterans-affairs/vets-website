const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_PROMO } = require('./block-fragments/promo.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

/**
 * The top-level page for a section of the website.
 * Examples include /health-care/, /disability/, etc.
 */
const ADMIN = '...administration';

module.exports = `

  fragment landingPage on NodeLandingPage {
    ${entityElementsFromPages}
    fieldIntroText
    ${FIELD_PROMO}
    ${FIELD_RELATED_LINKS}
    ${FIELD_ALERT}
    fieldTitleIcon
    fieldSpokes {
      entity {
        ...listOfLinkTeasers
      }
    }
    fieldLinks { title url { path } }
    fieldSupportServices {
      ...on FieldNodeFieldSupportServices {
        entity {
          entityId
          entityBundle
          ...on NodeSupportService {
            entityId
            entityBundle
            title
            fieldLink {
              url {
                path
              }
              title
              options
            }
            fieldPhoneNumber
          }
        }
      }
    }
    fieldPlainlanguageDate {
      value
      date
    }
    fieldPageLastBuilt {
      date
    }
    changed
    ${ADMIN}
  }
`;
