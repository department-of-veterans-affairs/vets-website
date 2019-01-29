const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const alert = require('./block-fragments/alert.block.graphql');

/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

module.exports = `

  ${wysiwyg}
  ${collapsiblePanel}
  ${process}
  ${qaSection}
  ${alert}
  
  fragment page on NodePage {
    entityUrl {
      path
    }
    entityBundle
    title
    fieldIntroText
    fieldDescription
    fieldContentBlock {
      entity {
        ... wysiwyg
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
  }
`;
