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
}
`;

module.exports = fragment;
