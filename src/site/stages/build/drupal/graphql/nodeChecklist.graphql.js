const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeChecklist on NodeChecklist {
  ${entityElementsFromPages}
  entityBundle

  changed
  title
  fieldDescription
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
  fieldRelatedInformation {
    entity {
      ... on ParagraphLinkTeaser {
        fieldLink {
          url {
            path
            routed
          }
          uri
          title
          options
        }
        fieldLinkSummary
      }
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
