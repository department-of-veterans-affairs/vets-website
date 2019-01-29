/**
 * A Drupal paragraph containing steps in a process.
 *
 */
module.exports = `
  fragment process on ParagraphProcess {
      entityBundle
      fieldSteps {
        processed
      }
  }
`;
