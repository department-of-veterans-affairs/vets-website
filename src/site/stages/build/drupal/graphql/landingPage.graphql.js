const { FIELD_PROMO } = require('./block-fragments/promo.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
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
    entityId
    entityBundle
    entityPublished
    title
    fieldIntroText
    ${FIELD_PROMO}
    ${FIELD_RELATED_LINKS}
    ${FIELD_ALERT}
    fieldSpokes {
      entity {
        ...listOfLinkTeasers
      }
    }    
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
              uri
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
  }
`;
