/**
 * The 'WYSIWYG' bundle of the 'Paragraph' entity type.
 */
module.exports = `
  fragment wysiwyg on ParagraphWysiwyg {
    entityId
    parentType
    entityLabel
    entityBundle
    entityPublished
    entityType
    fieldWysiwyg {
      value
      format
      processed
    }
  }
`;
