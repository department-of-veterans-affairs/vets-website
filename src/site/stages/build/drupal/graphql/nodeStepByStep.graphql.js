const entityElementsFromPages = require('./entityElementsForPages.graphql');

const ALERT_PARAGRAPH = '... alertParagraph';
const COLLAPSIBLE_PANEL = '... collapsiblePanel';
const DOWNLOADABLE_FILE_PARAGRAPH = '... downloadableFile';
const LIST_OF_LINK_TEASERS = '... listOfLinkTeasers';
const MEDIA_PARAGRAPH = '... embeddedImage';
const NUMBER_CALLOUT = '... numberCallout';
const PROCESS = '... process';
const QA_SECTION = '... qaSection';
const REACT_WIDGET = '... reactWidget';
const SPANISH_SUMMARY = '... spanishSummary';
const TABLE = '... table';
const WYSIWYG = '... wysiwyg';

const fragment = `
fragment nodeStepByStep on NodeStepByStep {
  ${entityElementsFromPages}
  entityBundle
  fieldSteps {
    entity {
      entityBundle
      entityType
      ${ALERT_PARAGRAPH}
      ${COLLAPSIBLE_PANEL}
      ${DOWNLOADABLE_FILE_PARAGRAPH}
      ${LIST_OF_LINK_TEASERS}
      ${MEDIA_PARAGRAPH}
      ${NUMBER_CALLOUT}
      ${PROCESS}
      ${QA_SECTION}
      ${REACT_WIDGET}
      ${SPANISH_SUMMARY}
      ${TABLE}
      ${WYSIWYG}
    }
  }
}
`;

module.exports = fragment;
