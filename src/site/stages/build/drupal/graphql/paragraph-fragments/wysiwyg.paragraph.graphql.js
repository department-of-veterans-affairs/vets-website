/**
 * A Drupal paragraph containing rich text.
 *
 */
module.exports = `
  fragment wysiwyg on ParagraphWysiwyg {
      entityId
      fieldWysiwyg {
        processed
      }
  }
`;
