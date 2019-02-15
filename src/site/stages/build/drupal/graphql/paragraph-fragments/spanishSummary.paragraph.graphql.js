/**
 * A Drupal paragraph containing rich text.
 *
 */
module.exports = `
  fragment spanishSummary on ParagraphSpanishTranslationSummary {
    entityId
    fieldWysiwyg {
      processed
    }
    fieldTextExpander
  }
`;
