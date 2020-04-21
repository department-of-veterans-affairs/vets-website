/*
*
* A reusable or non-reusable alert, either "information status" or "warning status".
*
 */
module.exports = `
  fragment alertParagraph on ParagraphAlert {
      entityId
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
            entityId
            fieldAlertTitle
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
