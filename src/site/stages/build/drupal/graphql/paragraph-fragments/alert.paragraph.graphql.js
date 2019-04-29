/*
*
* A reusable or non-reusable alert, either "information status" or "warning status".
*
 */
module.exports = `
  fragment alertParagraph on ParagraphAlert {      
      fieldAlertType
      fieldAlertHeading
      fieldAlertBlockReference {
        entity {
          ... on BlockContentAlert {
            fieldAlertTitle
            fieldHelpText
            fieldAlertType
            fieldReusability
            fieldAlertContent {
              entity {
                ... on ParagraphWysiwyg {
                  fieldWysiwyg {
                    processed
                  }
                }
                ... on ParagraphExpandableText {
                  entityId
                  entityBundle
                  fieldWysiwyg {
                    processed
                  }
                  fieldTextExpander
                }
              }
            }
          }
        }
      }
      fieldVaParagraphs {
        entity {
          ... on ParagraphWysiwyg {
            fieldWysiwyg {
              processed
            }
          }
          ... on ParagraphExpandableText {
            entityId
            entityBundle
            fieldWysiwyg {
              processed
            }
            fieldTextExpander
          }
        }
      }
  }
`;
