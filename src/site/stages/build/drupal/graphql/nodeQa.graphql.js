const entityElementsFromPages = require('./entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const ALERT_PARAGRAPH = '... alertParagraph';
const BUTTON = '... button';

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle
  fieldAnswer {
    entity {
      entityType
      entityBundle
      ${WYSIWYG}
      ${ALERT_PARAGRAPH}
    }
  }
  fieldButtons {
    entity {
      ${BUTTON}
    }
  }
}
`;

module.exports = fragment;
