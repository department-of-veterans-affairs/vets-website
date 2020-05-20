/**
 * A Drupal paragraph for react widgets.
 *
 */
module.exports = `
  fragment reactWidget on ParagraphReactWidget {
    entityId
    fieldTimeout
    fieldCtaWidget
    fieldWidgetType
    fieldDefaultLink {
      url {
        path
      }
      title
    }
    fieldButtonFormat
    fieldErrorMessage {
      value
    }
    fieldLoadingMessage
  }
`;
