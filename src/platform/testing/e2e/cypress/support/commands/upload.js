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
        const testFile = new File([blob], fileName, {
          // skip asynchronous file checks in e2e upload tests
          type: 'testing',
        });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);

        // eslint-disable-next-line no-param-reassign
        input[0].files = dataTransfer.files;
        return input;
      })
      .trigger('change', { force: true, log: false });

    Cypress.log({
      message: fileName,
      consoleProps: () => ({ fileName, fileType, input }),
    });
  },
);
