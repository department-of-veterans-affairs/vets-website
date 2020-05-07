/**
 * A top level detail page.
 */

const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

const WYSIWYG = '... wysiwyg';
const STAFF = '... staffProfile';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const NUMBER_CALLOUT = '... numberCallout';
const TABLE = '... table';
const ALERT_PARAGRAPH = '... alertParagraph';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const MEDIA_PARAGRAPH = '... embeddedImage';
const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
  fragment vamcTopTaskPage on NodeVamcTopTaskPage {
    title
    ${entityElementsFromPages}
    entityBundle
    changed
    fieldIntroText
    fieldTableOfContentsBoolean
    fieldFeaturedContent {
      entity {
        entityType
        entityBundle
        ${WYSIWYG}
        ${QA}
      }
    }
    fieldContentBlock {
      entity {
        entityType
        entityBundle
        ${STAFF}
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}
        ${QA}
        ${LIST_OF_LINK_TEASERS}
        ${REACT_WIDGET}
        ${NUMBER_CALLOUT}
        ${TABLE}
        ${ALERT_PARAGRAPH}
        ${DOWNLOADABLE_FILE_PARAGRAPH}
        ${MEDIA_PARAGRAPH}
      }
    }
    ${FIELD_RELATED_LINKS}
    ${FIELD_ALERT}
    fieldOffice {
      entity {
        ...on NodeHealthCareRegionPage {
          entityLabel
          title
          fieldNicknameForThisFacility
        }
      }
    }
  }
`;
