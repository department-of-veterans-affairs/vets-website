const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeMediaListVideos on NodeMediaListVideos {
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
