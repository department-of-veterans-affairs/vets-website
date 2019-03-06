/**
 * A Drupal paragraph for react widgets.
 *
 */
module.exports = `
  fragment reactWidget on ParagraphReactWidget {
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
