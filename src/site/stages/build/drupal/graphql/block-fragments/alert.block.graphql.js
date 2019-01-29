/**
 * An alert block in Drupal
 *
 */
module.exports = `
  fragment alert on BlockContentAlert {
  fieldAlertType
  fieldHelpText
  fieldAlertTitle
  fieldReusability
  fieldAlertContent {
    entity {
      ... on ParagraphWysiwyg {
        fieldWysiwyg {
          processed
        }
      }
      ... on ParagraphExpandableText {
        fieldWysiwyg {
          processed
        }
        fieldTextExpander
      }
    }
  }
}
`;
