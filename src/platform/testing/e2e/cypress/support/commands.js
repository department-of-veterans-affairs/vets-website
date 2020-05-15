/**
 * Workaround to support file upload functionality in tests,
 * which is currently not officially implemented.
 *
 * https://github.com/cypress-io/cypress/issues/170#issuecomment-619758213
 */
Cypress.Commands.add(
  'upload',
  { prevSubject: 'element' },
  (input, fileName, fileType) => {
    cy.fixture(fileName, 'base64')
      .then(content => Cypress.Blob.base64StringToBlob(content, fileType))
      .then(blob => {
        const testFile = new File([blob], fileName);
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);

        // eslint-disable-next-line no-param-reassign
        input[0].files = dataTransfer.files;
        return input;
      })
      .trigger('change', { force: true });
  },
);

(() => {
  // When uninitialized, cy.syncFixtures will clean the temp dir where
  // fixtures are getting loaded. After initialization, subsequent calls
  // to cy.syncFixtures will continue syncing fixtures under the temp dir.
  let initialized = false;

  /**
   * Runs task to sync fixtures under a temp path in the Cypress fixtures folder
   * then overwrites cy.fixture to look for fixtures under that temp path.
   */
  Cypress.Commands.add('syncFixtures', fixtures => {
    cy.task('_syncFixtures', { fixtures, initialized }).then(dir => {
      if (!initialized) {
        Cypress.Commands.overwrite('fixture', (originalFn, path, options) =>
          originalFn(`${dir}/${path}`, options),
        );

        initialized = true;
      }
    });
  });
})();
