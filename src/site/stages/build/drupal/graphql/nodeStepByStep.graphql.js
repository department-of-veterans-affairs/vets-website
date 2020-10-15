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
        fieldSectionHeader
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
