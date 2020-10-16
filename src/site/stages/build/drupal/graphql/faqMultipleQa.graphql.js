const entityElementsFromPages = require('./entityElementsForPages.graphql');

const WYSIWYG = '... wysiwyg';
const BUTTON = '... button';
const ALERT_SINGLE = '... alertSingle';
const REACT_WIDGET = '... reactWidget';

// faq_multiple_q_a, 6898
module.exports = `
fragment faqMultipleQA on NodeFaqMultipleQA {
  ${entityElementsFromPages}
  entityBundle
  changed

  fieldTableOfContentsBoolean
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldQAGroups {
    entity {
      ... on ParagraphQAGroup {
        fieldSectionHeader
        fieldQAs {
          entity {
            ... on NodeQA {
              title
              entityId
              entityBundle
              fieldAnswer {
                entity {
                  entityType
                  entityBundle
                  ${WYSIWYG}
                  ${REACT_WIDGET}
                }
              }
            }
          }
        }
      }
    }
  }
  fieldAlertSingle {
    entity {
      ${ALERT_SINGLE}
    }
  }
  fieldButtonsRepeat
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
            ... supportService
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
  fieldPrimaryCategory {
    entity {
      ... on taxonomyTermLcCategories
    }
  }
  fieldOtherCategories {
    entity {
      ... taxonomyTermLcCategories
    }
  }
  fieldTags {
    entity {
      ... audienceTopics
    }
  }
}
`;
