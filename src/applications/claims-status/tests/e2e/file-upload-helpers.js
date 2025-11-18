/**
 * Helper functions for file upload E2E tests
 */

/**
 * Gets a file input element by index
 * @param {number} fileIndex - The index of the file input (default: 0)
 * @returns {Cypress.Chainable} - The file input element
 */
export function getFileInputElement(fileIndex = 0) {
  return cy
    .get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .eq(fileIndex);
}

/**
 * Uploads a file to the file input
 * @param {string} fileName - The name of the file to upload
 * @param {number} fileIndex - The index of the file input (default: 0)
 */
export function uploadFile(fileName, fileIndex = 0) {
  getFileInputElement(fileIndex)
    .shadow()
    .find('input[type="file"]')
    .selectFile({
      contents: Cypress.Buffer.from('test content'),
      fileName,
    });
}

/**
 * Selects a document type from the document type dropdown
 * @param {number} fileIndex - The index of the file input (default: 0)
 * @param {string} docTypeCode - The document type code to select (e.g., 'L034')
 */
export function selectDocumentType(fileIndex, docTypeCode) {
  getFileInputElement(fileIndex)
    .find('va-select')
    .should('be.visible')
    .shadow()
    .find('select')
    .should('not.be.disabled')
    .should('be.visible')
    .wait(100) // Small wait to ensure stability
    .select(docTypeCode);
}

/**
 * Sets up a Cypress intercept to mock an unknown error (500) response
 * for document upload requests
 */
export function setupUnknownErrorMock() {
  cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
    statusCode: 500,
    body: {
      errors: [
        {
          title: 'Internal Server Error',
          code: '500',
          status: '500',
        },
      ],
    },
  }).as('uploadRequest');
}

/**
 * Sets up a Cypress intercept to mock a duplicate file error (422) response
 * for document upload requests
 */
export function setupDuplicateErrorMock() {
  cy.intercept('POST', '/v0/benefits_claims/*/benefits_documents', {
    statusCode: 422,
    body: {
      errors: [
        {
          title: 'Unprocessable Entity',
          detail: 'DOC_UPLOAD_DUPLICATE',
          code: '422',
          status: '422',
          source: 'BenefitsDocuments::Service',
        },
      ],
    },
  }).as('uploadRequest');
}
