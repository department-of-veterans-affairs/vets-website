module.exports = `
fragment alertSingle on ParagraphAlertSingle {
  entityId
  fieldAlertSelection
  fieldAlertNonReusableRef {
    entity {
      ... on ParagraphNonReusableAlert {
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
      }
    }
  }
  fieldAlertBlockReference {
    entity {
      ... on BlockContentAlert {
        entityId
        entityPublished
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
