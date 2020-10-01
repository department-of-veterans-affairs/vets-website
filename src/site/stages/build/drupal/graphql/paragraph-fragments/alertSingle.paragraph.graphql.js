const ALERT_PARAGRAPH = '... alertParagraph';

module.exports = `
fragment alertSingle on ParagraphAlertSingle {
  entityId
  fieldAlertSelection
  fieldAlertNonReusableRef {
    entity {
      ${ALERT_PARAGRAPH}
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
