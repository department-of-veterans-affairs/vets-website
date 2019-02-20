/**
 * The 'Spanish summary' bundle of the 'Paragraph' entity type.
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
