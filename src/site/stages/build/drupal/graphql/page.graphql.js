const { alert, FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const collapsiblePanel = require('./paragraph-fragments/collapsiblePanel.paragraph.graphql');
const {
  listOfLinkTeasers,
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const process = require('./paragraph-fragments/process.paragraph.graphql');
const qaSection = require('./paragraph-fragments/qaSection.paragraph.graphql');
const wysiwyg = require('./paragraph-fragments/wysiwyg.paragraph.graphql');
const sidebarItem = require('./nav-fragments/sidebarItem.nav.graphql');

/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

const WYSIWYG = '...wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const SIDEBAR_ITEM = '... sidebarItem';

module.exports = `

  ${wysiwyg}
  ${collapsiblePanel}
  ${process}
  ${qaSection}
  ${alert}
  ${listOfLinkTeasers}
  ${sidebarItem}
  
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
    ${SIDEBAR_ITEM}
    fieldPageLastBuilt {
      date
    }    
    changed    
  }
`;
