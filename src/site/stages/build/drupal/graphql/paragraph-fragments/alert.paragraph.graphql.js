/*
*
* A reusable or non-reusable alert, either "information status" or "warning status".
*
 */
module.exports = `
  fragment alertParagraph on ParagraphAlert {      
      fieldAlertType
      fieldAlertHeading
      fieldVaParagraphs {
        entity {
          ... on ParagraphWysiwyg {
            entityId
            entityBundle
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
                  entityId
                  entityBundle
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
  }
`;
