/**
 * The 'table' bundle of the 'Paragraph' entity type.
 *
 */

module.exports = `
  fragment table on ParagraphTable {
    entityId
    entityBundle
    fieldTable {
      tableValue
      value
      format
      caption
    }
  }
`;
