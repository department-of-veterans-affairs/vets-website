/**
 * A Drupal paragraph containing a collapsible panel with child items
 *
 */
module.exports = `
  fragment collapsiblePanel on ParagraphCollapsiblePanel {
      entityBundle
      fieldCollapsiblePanelMulti
      fieldCollapsiblePanelExpand
      fieldCollapsiblePanelBordered
      fieldVaParagraphs {
        entity {
          ... on ParagraphCollapsiblePanelItem {
            fieldTitle
            fieldWysiwyg {
              processed
            }
          }
        }
      }
  }
`;
