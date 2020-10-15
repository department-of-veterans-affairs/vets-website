const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeChecklist on NodeChecklist {
  ${entityElementsFromPages}
  entityBundle

  changed
  title
  fieldIntroTextLimitedHtml {
    processed
  }

  fieldButtonsRepeat
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
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
  fieldChecklist {
    entity {
      ... on ParagraphChecklist {
        fieldChecklistSections {
          entity {
            ... on ParagraphChecklistItem {
              fieldSectionIntro
              fieldSectionHeader
              fieldChecklistItems
            }
          }
        }
      }
    }
  }
}
`;

module.exports = fragment;
