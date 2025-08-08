import TrackClaimsPageV2 from './page-objects/TrackClaimsPageV2';
import claimsList from './fixtures/mocks/lighthouse/claims-list.json';
import claimDetailsOpen from './fixtures/mocks/lighthouse/claim-detail-open.json';

describe('VA File Input Multiple - TDD E2E Tests', () => {
  const setupComponentTest = () => {
    const trackClaimsPage = new TrackClaimsPageV2();
    trackClaimsPage.loadPage(claimsList, claimDetailsOpen);
    trackClaimsPage.verifyInProgressClaim(true);
    trackClaimsPage.navigateToFilesTab();
    cy.injectAxe();
  };

  const clickSubmitButton = () => {
    cy.get('va-button[text="Submit documents for review"]')
      .shadow()
      .find('button')
      .click();
  };

  const getFileInputElement = (fileIndex = 0) =>
    cy
      .get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex);

  const getFileInput = (fileIndex = 0) =>
    getFileInputElement(fileIndex).shadow();

  const selectDocumentType = (fileIndex, docTypeCode) => {
    getFileInputElement(fileIndex)
      .find('va-select')
      .should('be.visible')
      .shadow()
      .find('select')
      .should('not.be.disabled')
      .should('be.visible')
      .wait(100) // Small wait to ensure stability
      .select(docTypeCode);
  };

  const uploadFile = (fileName, fileIndex = 0) => {
    getFileInput(fileIndex)
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName,
      });
  };

  const uploadEncryptedPDF = (fileName, fileIndex = 0) => {
    getFileInput(fileIndex)
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('%PDF-1.4\n/Encrypt\nsome content'),
        fileName,
        mimeType: 'application/pdf',
      });
  };

  const getAboveFileInputError = (fileIndex = 0) =>
    getFileInput(fileIndex).find('#file-input-error-alert');

  const getFileError = (fileIndex = 0) =>
    getFileInput(fileIndex).find('#input-error-message');

  // Helper function for encrypted file workflow: upload + wait for password input
  const setupEncryptedFile = (fileName, fileIndex = 0) => {
    uploadEncryptedPDF(fileName, fileIndex);
    getFileInput(fileIndex)
      .find('va-text-input')
      .should('be.visible');
  };

  describe('Component display and instructions', () => {
    it('should display correct label and hint text', () => {
      setupComponentTest();

      // Verify the component is visible and displays the label and hint text
      cy.get('va-file-input-multiple').should('be.visible');

      cy.get('va-file-input-multiple')
        .shadow()
        .should('contain.text', 'Upload additional evidence')
        .and(
          'contain.text',
          'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file',
        );

      cy.axeCheck();
    });

    it('should display file input instructions to the user', () => {
      setupComponentTest();

      // Navigate to the file input's shadow DOM and verify instructions are visible
      getFileInput(0)
        .should('contain.text', 'Drag a file here')
        .and('contain.text', 'choose from folder');

      cy.axeCheck();
    });
  });

  describe('Adding files by clicking and dragging', () => {
    it('should allow users to add files by clicking and dragging', () => {
      setupComponentTest();

      const clickFile = 'click-file.pdf';
      const dragFile = 'drag-file.pdf';

      // Select first file (simulates clicking to choose file)
      // Note: "choose from folder" text is not clickable (pointer-events: none)
      uploadFile(clickFile);

      // Select second file (simulates dragging another file)
      // After first file, component creates a new input for additional files
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .last() // Use .last() to get the newest input
        .shadow()
        .find('input[type="file"]')
        .selectFile(
          {
            contents: Cypress.Buffer.from('dragged content'),
            fileName: dragFile,
          },
          { action: 'drag-drop' },
        );

      // Verify both file names are visible to the user
      getFileInput(0).should('contain.text', clickFile);

      // Verify second file appears in the second file input
      getFileInput(1).should('contain.text', dragFile);

      cy.axeCheck();
    });
  });

  describe('File validation and error handling', () => {
    it('should show error message when submit clicked without files', () => {
      setupComponentTest();

      // Click submit without selecting any files
      clickSubmitButton();

      // Verify error message appears in the file input shadow DOM
      // Note: Web component content may not be visible in Cypress UI but tests work correctly
      // To debug visually, add .then(() => cy.pause()) after this assertion
      getAboveFileInputError()
        .should('be.visible')
        .and('contain.text', 'Please select a file first');

      cy.axeCheck();
    });

    it('should clear error when file is added after validation error', () => {
      setupComponentTest();

      // First trigger error by submitting without files
      clickSubmitButton();

      // Verify error appears
      getAboveFileInputError().should(
        'contain.text',
        'Please select a file first',
      );

      // Add a file
      uploadFile('test-file.pdf');

      // Verify error is cleared after adding file
      getAboveFileInputError().should('not.exist');

      cy.axeCheck();
    });

    it('should show error when uploading unsupported file type', () => {
      setupComponentTest();

      // The "accept" prop prevents clicking a file with unsupported extension (e.g., .exe, .mp4, .docx) but it can be dragged and dropped - but then there is this an error:
      getFileInput(0)
        .find('input[type="file"]')
        .selectFile(
          {
            contents: Cypress.Buffer.from('This is an executable file'),
            fileName: 'malicious-file.exe',
            mimeType: 'application/x-msdownload',
          },
          { action: 'drag-drop' },
        );

      // Verify error message appears
      getAboveFileInputError(0)
        .should('be.visible')
        .and('contain', 'This is not a valid file type');

      cy.axeCheck();
    });

    it('should show error when file extension does not match file format', () => {
      setupComponentTest();

      // Upload a file with mismatched extension (e.g., a text file renamed to .pdf)
      getFileInput(0)
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from(
            'This is plain text content, not a PDF',
          ),
          fileName: 'fake-pdf.pdf',
          mimeType: 'text/plain',
        });

      // Verify error message appears
      getFileError(0)
        .should('be.visible')
        .and(
          'contain',
          'The file extension doesn’t match the file format. Please choose a different file.',
        );

      cy.axeCheck();
    });

    it('should show error when file is 0 bytes', () => {
      setupComponentTest();

      // Upload an empty file (0 bytes)
      getFileInput(0)
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from(''),
          fileName: 'empty-file.txt',
          mimeType: 'text/plain',
        });

      // Verify error message appears
      getAboveFileInputError(0)
        .should('be.visible')
        .and(
          'contain',
          'The file you selected is empty. Files must be larger than 0B.',
        );

      cy.axeCheck();
    });

    // File size validation tests are complex to implement reliably in E2E tests
    // due to browser limitations with creating large files and mocking file sizes.
  });

  describe('Encrypted PDF password handling', () => {
    it('should show password input when encrypted PDF is uploaded', () => {
      setupComponentTest();

      // Upload an encrypted PDF file and verify password input appears
      uploadEncryptedPDF('encrypted-document.pdf');
      getFileInput(0)
        .find('va-text-input')
        .should('be.visible')
        .shadow()
        .should('contain.text', 'File password');

      cy.axeCheck();
    });

    it('should show password input for encrypted files ending with "pdf" (without dot)', () => {
      setupComponentTest();

      // Upload an encrypted file with name ending in "pdf" but without .pdf extension
      uploadEncryptedPDF('encrypted-document_pdf');
      getFileInput(0)
        .find('va-text-input')
        .should('be.visible')
        .shadow()
        .should('contain.text', 'File password');

      cy.axeCheck();
    });

    it('should not show password input when non-encrypted PDF is uploaded', () => {
      setupComponentTest();

      // Upload a regular PDF file without encryption signature
      uploadFile('regular-document.pdf');

      // Verify no password input appears
      getFileInput(0)
        .find('va-text-input')
        .should('not.exist');

      cy.axeCheck();
    });

    it('should show error when submitting encrypted file without password', () => {
      setupComponentTest();

      // Upload encrypted file and wait for password input
      setupEncryptedFile('encrypted-document.pdf');

      // Submit without entering password
      clickSubmitButton();

      // Verify password error appears
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a password to decrypt this file');

      cy.axeCheck();
    });

    it('should persist validation errors when adding another file', () => {
      setupComponentTest();

      // Upload encrypted file and wait for password input
      setupEncryptedFile('encrypted-document.pdf');

      // Submit without entering password to trigger error
      clickSubmitButton();
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a password to decrypt this file');

      // Add another file (should not clear the existing error)
      uploadFile('second-regular.pdf', 1);

      // Verify the original error still persists after adding another file
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a password to decrypt this file');

      // Verify the second file has no error
      getFileError(1).should('not.exist');

      cy.axeCheck();
    });

    it('should clear password error when password is entered', () => {
      setupComponentTest();

      // Upload encrypted file and wait for password input
      setupEncryptedFile('encrypted-document.pdf');

      // Submit without entering password to trigger error
      clickSubmitButton();
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a password to decrypt this file');

      // Enter a password in the password field
      getFileInput(0)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('test-password');

      // Verify error is cleared when password is entered
      getFileInput(0).should(
        'not.contain.text',
        'Please provide a password to decrypt this file',
      );

      cy.axeCheck();
    });
  });

  describe('Document type selection and validation', () => {
    it('should show document type select when file is added', () => {
      setupComponentTest();

      // Initially, no select should be visible
      getFileInput(0)
        .find('va-select')
        .should('not.exist');

      // Upload a file
      uploadFile('test-document.pdf');

      // Verify document type select appears with correct label
      // Based on the markup, the select appears as a child appended to va-file-input
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible');

      // Verify select has the correct label and options
      getFileInputElement(0)
        .find('va-select')
        .shadow()
        .should('contain.text', 'What type of document is this?')
        .and('contain.text', 'Required');

      cy.axeCheck();
    });

    it('should show error when submitting without selecting document type', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('test-document.txt');

      // Wait for file processing to complete by checking that document type selector appears
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible'); // This indicates file processing is done

      // Submit without selecting document type
      clickSubmitButton();

      // Verify document type error appears in the file input's error message area
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a response');

      cy.axeCheck();
    });

    it('should clear error when document type is selected after validation error', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('test-document.txt');

      // Wait for file processing to complete by checking that document type selector appears
      getFileInputElement(0)
        .find('va-select')
        .should('be.visible'); // This indicates file processing is done

      // Submit without selecting document type to trigger error
      clickSubmitButton();

      // Verify error appears
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a response');

      // Select a document type
      selectDocumentType(0, 'L014'); // Birth Certificate

      getFileError(0).should('not.exist');

      cy.axeCheck();
    });
  });

  describe('File removal and data retention', () => {
    it('should show confirmation modal when clicking remove button and remove file when confirming in modal', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('document-to-remove.txt');

      // Click the delete button
      getFileInput(0)
        .should('contain.text', 'document-to-remove.txt')
        .find('va-button-icon[aria-label*="delete file"]')
        .shadow()
        .find('button')
        .click();

      // Verify modal appears with correct content
      cy.get('va-modal[status="warning"]')
        .should('be.visible')
        .should('contain.text', 'document-to-remove.txt')
        .shadow()
        .should('contain.text', 'Delete this file?');

      // Click "Yes, remove this" in the modal (first button)
      cy.get('va-modal')
        .shadow()
        .find('va-button')
        .first()
        .shadow()
        .find('button')
        .should('contain', 'Yes, remove this')
        .click();

      // Verify file is removed
      getFileInput(0).should('not.contain.text', 'document-to-remove.txt');

      // Verify modal is closed
      cy.get('va-modal[status="warning"]').should('not.exist');

      cy.axeCheck();
    });

    it('should keep file when canceling in modal', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('document-to-keep.txt');

      // Click the delete button
      getFileInput(0)
        .should('contain.text', 'document-to-keep.txt')
        .find('va-button-icon[aria-label*="delete file"]')
        .shadow()
        .find('button')
        .click();

      // Click "No, keep this" in the modal (secondary button)
      cy.get('va-modal')
        .shadow()
        .find('va-button[secondary]')
        .shadow()
        .find('button')
        .should('contain', 'No, keep this')
        .click();

      // Verify file is still there
      getFileInput(0).should('contain.text', 'document-to-keep.txt');

      cy.axeCheck();
    });

    it('should retain data for remaining files when one is removed', () => {
      setupComponentTest();

      // Upload first file and set document type
      uploadFile('first-document.txt', 0);
      selectDocumentType(0, 'L014'); // Birth Certificate

      // Upload second encrypted file with password
      setupEncryptedFile('encrypted-document.pdf', 1);
      getFileInput(1)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('test-password');

      // Set document type for second file
      selectDocumentType(1, 'L029'); // Copy of a DD214

      // Upload third file and set document type
      uploadFile('third-document.txt', 2);
      selectDocumentType(2, 'L070'); // Medical records

      // Remove the middle file (encrypted one)
      getFileInput(1)
        .should('contain.text', 'encrypted-document.pdf')
        .find('va-button-icon[aria-label*="delete file"]')
        .shadow()
        .find('button')
        .click();

      // Confirm removal in modal
      cy.get('va-modal')
        .shadow()
        .find('va-button')
        .first()
        .shadow()
        .find('button')
        .click();

      // Verify remaining files still have their data
      // First file should still have its document type
      getFileInput(0).should('contain.text', 'first-document.txt');

      getFileInputElement(0)
        .find('va-select')
        .shadow()
        .find('select')
        .should('have.value', 'L014');

      // Third file (now at index 1) should still have its document type
      getFileInput(1).should('contain.text', 'third-document.txt');

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(1)
        .find('va-select')
        .shadow()
        .find('select')
        .should('have.value', 'L070');

      // Verify only 2 file inputs remain (plus the empty one for new files)
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .should('have.length', 3); // 2 files + 1 empty input

      cy.axeCheck();
    });

    it('should retain validation errors for remaining files after removal', () => {
      setupComponentTest();

      // Upload encrypted file without password
      setupEncryptedFile('encrypted-without-password.pdf', 0);

      // Upload regular file without document type
      uploadFile('regular-without-doctype.txt', 1);

      // Wait for file processing
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(1)
        .find('va-select')
        .should('be.visible');

      // Submit to trigger validation errors
      clickSubmitButton();

      // Verify both files have errors
      getFileError(0).should('contain.text', 'Please provide a password');
      getFileError(1).should('contain.text', 'Please provide a response');

      // Remove the first file (encrypted one)
      getFileInput(0)
        .should('contain.text', 'encrypted-without-password.pdf')
        .find('va-button-icon[aria-label*="delete file"]')
        .shadow()
        .find('button')
        .click();

      // Confirm removal in modal
      cy.get('va-modal')
        .shadow()
        .find('va-button')
        .first()
        .shadow()
        .find('button')
        .click();

      // Verify the remaining file still has its error
      getFileError(0).should('contain.text', 'Please provide a response');

      cy.axeCheck();
    });
  });

  describe('Submit button functionality and upload modal', () => {
    beforeEach(() => {
      cy.intercept('POST', '/v0/benefits_claims/189685/benefits_documents', {
        delay: 500,
        body: {},
      }).as('documents');
    });

    it('should send correct data contract to backend API', () => {
      setupComponentTest();

      // Set up intercept to capture the actual request payload
      cy.intercept(
        'POST',
        '/v0/benefits_claims/189685/benefits_documents',
        req => {
          // This is the CRITICAL test - verify exact payload structure sent to backend
          const formData = req.body;

          // Extract the multipart form data fields
          expect(formData).to.contain('tracked_item_ids');
          expect(formData).to.contain('document_type');
          expect(formData).to.contain('password');

          // Verify tracked_item_ids is JSON stringified array with null (AdditionalEvidencePage case)
          expect(formData).to.include('[null]');

          // Verify document_type contains the actual document type value
          expect(formData).to.include('L029');

          // Verify password contains the actual password entered by user
          expect(formData).to.include('test-password');

          req.reply({ statusCode: 200, body: {} });
        },
      ).as('documentsWithPayloadCheck');

      // Upload an encrypted file (tests password handling + all other contract fields)
      setupEncryptedFile('contract-test.pdf');

      // Enter password (this is what would be broken by password regressions)
      getFileInput(0)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('test-password');

      // Select document type
      selectDocumentType(0, 'L029'); // Copy of a DD214

      // Submit the files - this will trigger our payload verification
      clickSubmitButton();

      // Wait for the request and verify it was made
      cy.wait('@documentsWithPayloadCheck');

      cy.axeCheck();
    });

    it('should allow submission when all validation passes', () => {
      setupComponentTest();

      // Upload encrypted file and provide password
      setupEncryptedFile('encrypted-with-password.pdf');
      getFileInput(0)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('valid-password');

      // Select document type for encrypted file
      selectDocumentType(0, 'L029'); // Copy of a DD214

      // Submit should work
      clickSubmitButton();

      // Verify upload modal appears with correct content
      cy.get('va-modal')
        .should('be.visible')
        .should('contain.text', 'Uploading files')
        .and('contain.text', 'Uploading 1 file...')
        .and(
          'contain.text',
          'Your files are uploading. Please do not close this window.',
        );

      // Success alert after successful file upload
      cy.wait('@documents');
      cy.get('va-alert')
        .should('be.visible')
        .and('contain.text', `We received your file upload on`)
        .and(
          'contain.text',
          'If your uploaded file doesn’t appear in the Documents Filed section on this page, please try refreshing the page.',
        );
      cy.axeCheck();
    });

    it('should allow canceling upload', () => {
      setupComponentTest();

      // Upload a file and set document type
      uploadFile('document-to-cancel.txt');
      selectDocumentType(0, 'L014'); // Birth Certificate

      // Submit the files
      clickSubmitButton();

      // Verify modal appears
      cy.get('va-modal').should('be.visible');

      // Click cancel button
      cy.get('va-modal')
        .find('va-button[text="Cancel"]')
        .shadow()
        .find('button')
        .click();

      // Verify modal is closed
      cy.get('va-modal').should('not.be.visible');

      cy.axeCheck();
    });

    // Error alert for invalid password
    it('should show error when submitting PDF with invalid password', () => {
      setupComponentTest();

      const errorMessage =
        'We couldn’t unlock your PDF. Save the PDF without a password and try again.';
      const fileName = 'encrypted-document.pdf';
      // Mock a server error response for invalid password
      cy.intercept('POST', `/v0/benefits_claims/189685/benefits_documents`, {
        statusCode: 422,
        body: {
          errors: [
            {
              title: errorMessage,
            },
          ],
        },
      }).as('documentsError');

      // Upload encrypted file with incorrect password
      setupEncryptedFile(fileName);
      getFileInput(0)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('wrong-password');

      // Select document type
      selectDocumentType(0, 'L029'); // Copy of a DD214

      // Submit the files
      clickSubmitButton();

      // Wait for error response
      cy.wait('@documentsError');

      // Verify error alert appears with correct content
      cy.get('va-alert[status="error"]').should('be.visible');
      cy.get('va-alert[status="error"] h2').should(
        'contain.text',
        `Error uploading ${fileName}`,
      );
      cy.get('va-alert[status="error"] p').should('contain.text', errorMessage);

      cy.axeCheck();
    });
  });
});
