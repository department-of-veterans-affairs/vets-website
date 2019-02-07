/**
 * A Drupal paragraph for sets of questions and answers.
 *
 */
module.exports = `
  fragment qaSection on ParagraphQASection {
    fieldSectionHeader
    fieldSectionIntro
    fieldAccordionDisplay
    fieldQuestions {
      entity {
        ... qa
      }
    }
  }
`;
