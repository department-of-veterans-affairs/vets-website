/**
 * An alert block in Drupal
 *
 */

const FIELD_ALERT = `
fieldAlert {
  entity {
    entityId
    entityBundle
    ... on BlockContentAlert {
      ... alert
    }
  }
}
`;

const alert = `
fragment alert on BlockContentAlert {
  entityId
  entityPublished
  fieldAlertDismissable
  fieldAlertType
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

module.exports = { alert, FIELD_ALERT };
