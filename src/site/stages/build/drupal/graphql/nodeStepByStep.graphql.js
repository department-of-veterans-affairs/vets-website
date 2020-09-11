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
        fieldStep {
          entity {
            ... on ParagraphStep {
              fieldWysiwyg {
                processed
              }
              fieldMedia {
                entity {
                  ... on Media {
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
  fieldRelatedLinks {
    entity {
      ... listOfLinkTeasers
    }
  }
}
`;

module.exports = fragment;
