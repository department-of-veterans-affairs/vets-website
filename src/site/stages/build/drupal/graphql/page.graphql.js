const wysiwyg = require('./paragraph-fragments/paragraphWysiwyg.graphql');
const collapsiblePanel = require('./paragraph-fragments/paragraphCollapsiblePanel.graphql');
const process = require('./paragraph-fragments/paragraphProcess.graphql');

/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */
module.exports = `
  ${wysiwyg}
  ${collapsiblePanel}
  ${process}
  
  fragment page on NodePage {
    entityUrl {
      path
    }
    title
    fieldIntroText
    fieldDescription
    fieldContentBlock {
      entity {
        ... wysiwyg
        ... collapsiblePanel
        ... process
        entityType
        entityBundle
        entityRendered
      }
    }
    fieldAlert {
      entity {
        entityBundle
        ... on BlockContentAlert {
          fieldAlertType
          fieldAlertTitle
          fieldAlertContent {
            entity {
              ... on ParagraphExpandableText {
                fieldWysiwyg {
                  processed
                }
                fieldTextExpander
              }
              ... on ParagraphWysiwyg {
                fieldWysiwyg {
                  processed
                }
              }
            }
          }
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
