const alert = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const listOfLinkTeasers = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');

/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

const WYSIWYG_FRAGMENT = '...wysiwyg';
const LISTOFLINKTEASERS_FRAGMENT = '...listOfLinkTeasers';

const RELATED_LINKS = `
  fieldRelatedLinks {
      entity {
      	${LISTOFLINKTEASERS_FRAGMENT}
      }
    }
`;

module.exports = `

  ${wysiwyg}
  ${collapsiblePanel}
  ${process}
  ${qaSection}
  ${alert}
  ${listOfLinkTeasers}
  
  fragment page on NodePage {
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
    fieldDescription
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${WYSIWYG_FRAGMENT}
        ${LISTOFLINKTEASERS_FRAGMENT}
        ... collapsiblePanel
        ... process
        ... qaSection
      }
    }
    fieldAlert {
      entity {
        entityBundle
        ... on BlockContentAlert {
          ... alert
        }
      }
    }
    fieldRelatedLinks {
      entity {
        entityBundle
        ... on ParagraphListOfLinkTeasers {
         fieldTitle
          fieldVaParagraphs {
            entity {
              ... on ParagraphLinkTeaser {
                fieldLink {
                  uri
                  title
                }
                fieldLinkSummary
              }
            }
          }
        }
      }
    }
    fieldPageLastBuilt {
      date
    }
    ${RELATED_LINKS}
    changed    
  }
`;
