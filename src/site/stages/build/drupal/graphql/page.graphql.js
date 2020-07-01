const fragments = require('./fragments.graphql');
const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
/**
 * A standard content page, that is ordinarily two-levels deep (a child page of a landingPage)
 * For example, /health-care/apply.
 */

const WYSIWYG = '... wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const QA = '... qa';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const SPANISH_SUMMARY = '... spanishSummary';
const ALERT_PARAGRAPH = '... alertParagraph';
const TABLE = '... table';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const MEDIA_PARAGRAPH = '... embeddedImage';
const NUMBER_CALLOUT = '... numberCallout';

const fieldAministrationKey = 'FieldNodePageFieldAdministration';

module.exports = `
  ${fragments.wysiwyg}
  ${fragments.qa}
  ${fragments.collapsiblePanel}
  ${fragments.process}
  ${fragments.qaSection}
  ${fragments.listOfLinkTeasers}
  ${fragments.reactWidget}
  ${fragments.spanishSummary}
  ${fragments.table}
  ${fragments.alertParagraph}
  ${fragments.alert}
  ${fragments.downloadableFile}
  ${fragments.numberCallout}
  ${fragments.embeddedImage}
  fragment page on NodePage {
    ${entityElementsFromPages}
    fieldIntroText
    fieldDescription
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
        ${WYSIWYG}
        ${COLLAPSIBLE_PANEL}
        ${PROCESS}
        ${QA_SECTION}
        ${LIST_OF_LINK_TEASERS}
        ${REACT_WIDGET}
        ${SPANISH_SUMMARY}
        ${TABLE}
        ${ALERT_PARAGRAPH}
        ${DOWNLOADABLE_FILE_PARAGRAPH}
        ${MEDIA_PARAGRAPH}
        ${NUMBER_CALLOUT}
      }
    }
    ${FIELD_ALERT}
    ${FIELD_RELATED_LINKS}
    fieldAdministration {
      ... on ${fieldAministrationKey} {
        entity {
          ... on TaxonomyTermAdministration {
            name
          }
        }
      }
    }
    fieldPageLastBuilt {
      date
    }
    changed
  }
`;
