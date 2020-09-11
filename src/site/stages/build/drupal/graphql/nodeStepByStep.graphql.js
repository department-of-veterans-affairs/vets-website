const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeStepByStep on NodeStepByStep {
  ${entityElementsFromPages}
  entityBundle

  title
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
    }
  }
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldSteps {
    entity {
      ... on ParagraphStepByStep {
        entityLabel
        entityId
        entityBundle
        fieldStep {
          entity {
            ... on ParagraphStep {
              entityId
              entityLabel
              entityBundle
              fieldWysiwyg {
                processed
              }
              fieldMedia {
                entity {
                  ... on Media {
                    entityLabel
                    thumbnail {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

module.exports = fragment;
