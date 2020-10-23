/**
 * The alerts that appear above content.
 */

module.exports = `
fragment nodeBasicLandingPage on NodeBasicLandingPage {
  title
  created
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
