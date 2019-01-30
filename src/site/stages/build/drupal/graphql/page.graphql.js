const { alert, FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const {
  listOfLinkTeasers,
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');

/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

const WYSIWYG = '...wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';

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
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}        
      }
    }
    ${FIELD_ALERT} 
    ${FIELD_RELATED_LINKS}
    fieldPageLastBuilt {
      date
    }    
    changed    
  }
`;
