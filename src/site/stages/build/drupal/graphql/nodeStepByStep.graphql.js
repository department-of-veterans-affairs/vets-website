const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeStepByStep on NodeStepByStep {
  ${entityElementsFromPages}
  entityBundle

  changed
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
  fieldButtonsRepeat
  fieldSteps {
    entity {
      ... on ParagraphStepByStep {
        fieldStep {
          entity {
            ... on ParagraphStep {
              fieldWysiwyg {
                processed
              }
              fieldAlert {
                entity {
                  ... alertParagraph
                }
              }
              fieldMedia {
                entity {
                  ... on Media {
                    thumbnail {
                      alt
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
