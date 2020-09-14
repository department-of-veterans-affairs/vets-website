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
