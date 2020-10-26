const entityElementsFromPages = require('./entityElementsForPages.graphql');

module.exports = `
fragment nodeBasicLandingPage on NodeBasicLandingPage {
  ${entityElementsFromPages}
  title
  changed
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
      ... listsOfLinks
    }
  }
  fieldDescription
  fieldIntroTextLimitedHtml {
    value
    format
    processed
  }
  fieldMetaTitle
  fieldProduct {
    entity {
      entityBundle
      ... on TaxonomyTermProducts {
        name
      }
    }
  }
  fieldTableOfContentsBoolean
}
`;
