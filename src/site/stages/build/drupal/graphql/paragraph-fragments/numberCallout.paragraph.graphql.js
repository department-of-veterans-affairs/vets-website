/**
 * The 'Number callout' bundle of the 'Paragraph' entity type.
 *
 */
module.exports = `
  fragment numberCallout on ParagraphNumberCallout {
    entityId
    fieldShortPhraseWithANumber
    fieldWysiwyg {
      processed
    }
  }
`;
