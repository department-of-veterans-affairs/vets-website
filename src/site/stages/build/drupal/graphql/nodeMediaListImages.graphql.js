const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeMediaListImages on NodeMediaListImages {
  ${entityElementsFromPages}
  entityBundle

  changed
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
  fieldRelatedInformation {
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
              entityLabel
              fieldDescription
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
