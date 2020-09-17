const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeStepByStep on NodeStepByStep {
  ${entityElementsFromPages}
  entityBundle

  title
  fieldDescription
  fieldIntroTextLimitedHtml {
    processed
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
    }
  }
  fieldButtonsRepeat
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldRelatedLinks {
    entity {
      ... listOfLinkTeasers
    }
  }

  fieldMediaListVideos {
    entity {
      ... on ParagraphMediaListVideos {
        fieldSectionHeader
        fieldVideos {
          targetId
          entity {
            ... on MediaVideo {
              name
              fieldMediaVideoEmbedField
            }
          }
        }
      }
    }
  }
}
`;

module.exports = fragment;
