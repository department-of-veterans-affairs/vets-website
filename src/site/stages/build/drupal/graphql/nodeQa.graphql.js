const entityElementsFromPages = require('./entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const REACT_WIDGET = '... reactWidget';
const BUTTON = '... button';
const ALERT_SINGLE = '... alertSingle';

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle
  fieldAnswer {
    entity {
      entityType
      entityBundle
      ${WYSIWYG}
      ${REACT_WIDGET}
    }
  }
  fieldAlertSingle {
    entity {
      ${ALERT_SINGLE}
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
