const entityElementsFromPages = require('./entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const REACT_WIDGET = '... reactWidget';
const BUTTON = '... button';
const ALERT_SINGLE = '... alertSingle';

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle

  changed
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
  fieldRelatedBenefitHubs {
    entity {
      ... on NodeLandingPage {
        fieldSupportServices {
          entity {
            ... on NodeSupportService {
              title
              fieldLink {
                title
                url {
                  path
                  routed
                }
              }
              fieldPhoneNumber
            }
          }
        }
      }
    }
  }
  fieldRelatedInformation {
    entity {
      ... linkTeaser
    }
  }
}
`;

module.exports = fragment;
