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

  fieldMediaListImages {
    entity {
      ... on ParagraphMediaListImages {
        fieldSectionHeader
        fieldImages {
          entity {
            ... on MediaImage {
              image {
                alt
                height
                url
                width
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
