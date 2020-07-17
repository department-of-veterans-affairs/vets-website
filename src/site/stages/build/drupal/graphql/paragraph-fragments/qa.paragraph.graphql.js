/**
 * A Drupal paragraph for questions and answers. Answers come in the format of WYSIWYG, collapsible panel, and process.
 *
 */
module.exports = `
  fragment qa on ParagraphQA {
    parentFieldName
    entityId
    entityBundle
    fieldQuestion
    fieldAnswer {
      entity {
        entityBundle
        ... wysiwyg
        ... process
        ... collapsiblePanel
        ... numberCallout
        ... reactWidget
        ... table
        ... alertParagraph
      }
    }
  }
`;
