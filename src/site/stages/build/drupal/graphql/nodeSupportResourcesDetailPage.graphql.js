const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeSupportResourcesDetailPage on NodeSupportResourcesDetailPage {
  ${entityElementsFromPages}
  entityBundle
  changed
  title

  fieldContentBlock {
    entity {
      entityType
      entityBundle
      ... wysiwyg
      ... collapsiblePanel
      ... process
      ... qaSection
      ... qa
      ... listOfLinkTeasers
      ... reactWidget
      ... spanishSummary
      ... alertParagraph
      ... table
      ... downloadableFile
      ... embeddedImage
      ... numberCallout
    }
  }
  fieldTableOfContentsBoolean
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
