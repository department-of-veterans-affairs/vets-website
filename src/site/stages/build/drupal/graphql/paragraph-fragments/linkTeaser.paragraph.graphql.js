/**
 * The 'Link teaser' bundle of the 'Paragraph' entity type.
 */
module.exports = `
  fragment linkTeaser on ParagraphLinkTeaser {
    entityId
    fieldLink {
      url {
        path
      }
      title
      options
    }
    fieldLinkSummary
  }
`;
