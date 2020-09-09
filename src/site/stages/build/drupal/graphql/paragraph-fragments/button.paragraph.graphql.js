/**
 * The 'Embedded image' bundle of the 'Paragraph' entity type.
 *
 */
module.exports = `
fragment button on ParagraphButton {
  entityId
  entityBundle
  fieldButtonLabel
  fieldButtonLink {
    ... on FieldParagraphButtonFieldButtonLink {
      url {
        path
      }
    }
  }
}
`;
