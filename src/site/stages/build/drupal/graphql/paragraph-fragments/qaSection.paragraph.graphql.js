/**
 * A Drupal paragraph for sets of questions and answers.
 *
 */
module.exports = `
  fragment qaSection on ParagraphQASection {
    entityId
    fieldSectionHeader
    fieldSectionIntro
    fieldAccordionDisplay
    fieldQuestions {
      entity {
        entityId
        ... qa
      }
    }
  }
`;
