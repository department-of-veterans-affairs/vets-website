const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment mediaListImages on NodeMediaListImages {
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
