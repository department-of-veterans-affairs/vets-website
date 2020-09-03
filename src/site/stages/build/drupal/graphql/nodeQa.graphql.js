const entityElementsFromPages = require('./entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const REACT_WIDGET = '... reactWidget';
const SPANISH_SUMMARY = '... spanishSummary';
const ALERT_PARAGRAPH = '... alertParagraph';
const TABLE = '... table';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const MEDIA_PARAGRAPH = '... embeddedImage';
const NUMBER_CALLOUT = '... numberCallout';

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle
  fieldAnswer {
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
}
`;

module.exports = fragment;
