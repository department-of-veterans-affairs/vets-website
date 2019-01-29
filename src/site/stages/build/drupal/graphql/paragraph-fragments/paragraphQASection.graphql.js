/**
 * A Drupal paragraph questions in answers. Answers come in the format of WYSIWYG, collapsible panel, and process.
 *
 */
module.exports = `
  fragment qaSection on ParagraphQASection {
      entityBundle
      fieldSectionHeader
      fieldQuestions {
        entity {
          ... on ParagraphQA {
            fieldQuestion
            fieldAnswer {
              entity {
                ... on ParagraphWysiwyg {
                  fieldWysiwyg {
                    processed
                  }
                }
          ... on ParagraphCollapsiblePanel {
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
          ... on ParagraphProcess {
              entityBundle
              fieldSteps {
                processed
              }
                }
              }
            }
          }
        }
      }
  }
`;
