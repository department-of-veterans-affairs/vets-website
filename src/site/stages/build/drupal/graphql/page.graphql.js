const wysiwyg = require('./paragraph-fragments/paragraphWysiwyg.graphql');
const collapsiblePanel = require('./paragraph-fragments/paragraphCollapsiblePanel.graphql');
const process = require('./paragraph-fragments/paragraphProcess.graphql');
const listOfLinkTeasers = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');

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
  ${listOfLinkTeasers}
  
  fragment page on NodePage {
    entityUrl {
      path
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
    changed
    ${RELATED_LINKS}
  }
`;
