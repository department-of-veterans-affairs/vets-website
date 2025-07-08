describe('VA File Input Multiple - TDD E2E Tests', () => {
  const setupComponentTest = () => {
    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  const clickSubmitButton = () => {
    cy.get('va-button[text="Submit documents for review"]')
      .shadow()
      .find('button')
      .click();
  };

  const getFileInput = (fileIndex = 0) => {
    return cy
      .get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex)
      .shadow();
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

  const getFileError = (fileIndex = 0) =>
    getFileInput(fileIndex).find('#input-error-message');

  // Helper function for encrypted file workflow: upload + wait for password input
  const setupEncryptedFile = (fileName, fileIndex = 0) => {
    uploadEncryptedPDF(fileName, fileIndex);
    getFileInput(fileIndex)
      .find('va-text-input')
      .should('be.visible');
  };

  describe('User Story #1: Label and hint text', () => {
    it('should display correct label and hint text', () => {
      setupComponentTest();

      // Verify the component is visible and displays the label and hint text
      cy.get('va-file-input-multiple')
        .should('be.visible')
        .shadow()
        .should('contain.text', 'Upload additional evidence')
        .and(
          'contain.text',
          'You can upload a .pdf, .gif, .jpg, .jpeg, .bmp, or .txt file',
        );

      cy.axeCheck();
    });
  });

  describe('User Story #2: File input instructions', () => {
    it('should display file input instructions to the user', () => {
      setupComponentTest();

      // Navigate to the file input's shadow DOM and verify instructions are visible
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .should('contain.text', 'Drag a file here')
        .and('contain.text', 'choose from folder');

      cy.axeCheck();
    });
  });

  describe('User Story #3 and #4: Adding files by clicking and dragging', () => {
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
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .should('contain.text', clickFile);

      // Verify second file appears in the second file input
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(1)
        .shadow()
        .should('contain.text', dragFile);

      cy.axeCheck();
    });
  });

  describe('User Story #5: Submit validation with no files', () => {
    // Get error above file input
    const getNoFilesError = () => {
      return cy
        .get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('#file-input-error-alert');
    };

    it('should show error message when submit clicked without files', () => {
      setupComponentTest();

      // Click submit without selecting any files
      clickSubmitButton();

      // Verify error message appears in the file input shadow DOM
      // Note: Web component content may not be visible in Cypress UI but tests work correctly
      // To debug visually, add .then(() => cy.pause()) after this assertion
      getNoFilesError()
        .should('be.visible')
        .and('contain.text', 'Please select a file first');

      cy.axeCheck();
    });

    it('should clear error when file is added after validation error', () => {
      setupComponentTest();

      const fileName = 'test-file.pdf';

      // First trigger error by submitting without files
      clickSubmitButton();

      // Verify error appears
      getNoFilesError().should('contain.text', 'Please select a file first');

      // Add a file
      uploadFile(fileName);

      // Verify error is cleared after adding file
      getNoFilesError().should('not.exist');

      cy.axeCheck();
    });
  });

  describe('User Story #6: Encrypted file password input', () => {
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
  });

  describe('User Story #7: Password validation for encrypted files', () => {
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
  });

  describe('User Story #8: Password error persistence when adding files', () => {
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
  });

  describe('User Story #9: Password error clearing behavior', () => {
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
        .type('testpassword');

      // Verify error is cleared when password is entered
      getFileInput(0).should(
        'not.contain.text',
        'Please provide a password to decrypt this file',
      );

      cy.axeCheck();
    });
  });

  describe('User Story #10: Document type select field', () => {
    it('should show document type select when file is added', () => {
      setupComponentTest();

      // Initially, no select should be visible
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('va-select')
        .should('not.exist');

      // Upload a file
      uploadFile('test-document.pdf');

      // Verify document type select appears with correct label
      // Based on the markup, the select appears as a child appended to va-file-input
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .find('va-select')
        .should('be.visible');

      // Verify select has the correct label and options
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .find('va-select')
        .shadow()
        .should('contain.text', 'What type of document is this?')
        .and('contain.text', 'Required');

      cy.axeCheck();
    });
  });

  describe('User Story #11: Document type validation', () => {
    it('should show error when submitting without selecting document type', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('test-document.pdf');

      // Submit without selecting document type
      clickSubmitButton();

      // Verify document type error appears in the file input's error message area
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a response');

      cy.axeCheck();
    });
  });

  describe('User Story #12: Document type error clearing', () => {
    it.skip('should clear error when document type is selected after validation error', () => {
      setupComponentTest();

      // Upload a file
      uploadFile('test-document.pdf');

      // Submit without selecting document type to trigger error
      clickSubmitButton();

      // Verify error appears
      getFileError(0)
        .should('be.visible')
        .and('contain.text', 'Please provide a response');

      // Select a document type
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .find('va-select')
        .shadow()
        .find('select')
        .select('L014'); // Birth Certificate

      getFileError(0).should('not.exist');

      cy.axeCheck();
    });
  });

  // TODO: Remove this test when component development is complete
  // This test is for development debugging only and relies on UI that will be deleted
  describe('Comprehensive data tracking (Development Only - TODO: Delete)', () => {
    it('should track files, passwords, and document types correctly', () => {
      setupComponentTest();

      // Upload a regular file
      uploadFile('regular-document.pdf', 0);
      // Select document type for first file
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(0)
        .find('va-select')
        .shadow()
        .find('select')
        .select('L014'); // Birth Certificate

      // Upload an encrypted file
      setupEncryptedFile('encrypted-document.pdf', 1);

      // Enter password for encrypted file
      getFileInput(1)
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('secretpassword');

      // Select document type for second file
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(1)
        .find('va-select')
        .shadow()
        .find('select')
        .select('L029'); // Copy of a DD214

      // Verify both files are visible with their names
      getFileInput(0).should('contain.text', 'regular-document.pdf');
      getFileInput(1).should('contain.text', 'encrypted-document.pdf');

      // Verify both document type selects have the correct values
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(0)
        .find('va-select')
        .shadow()
        .find('select')
        .should('have.value', 'L014');

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .eq(1)
        .find('va-select')
        .shadow()
        .find('select')
        .should('have.value', 'L029');

      // Verify password is entered for encrypted file
      getFileInput(1)
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('have.value', 'secretpassword');

      // Submit first to extract and update document types data
      clickSubmitButton();

      // Now verify debug information shows correct data tracking after submit
      cy.get('[data-testid="debug-files"]')
        .should('contain.text', 'regular-document.pdf')
        .and('contain.text', 'encrypted-document.pdf');

      cy.get('[data-testid="debug-passwords"]')
        .should('contain.text', 'File 0: N/A') // Regular file doesn't need password
        .and('contain.text', 'File 1: secretpassword'); // Password is being tracked!

      cy.get('[data-testid="debug-doctypes"]')
        .should('contain.text', 'File 0: L014') // Birth Certificate
        .and('contain.text', 'File 1: L029'); // Copy of a DD214

      cy.get('[data-testid="debug-encrypted"]')
        .should('contain.text', 'File 0: Regular')
        .and('contain.text', 'File 1: Encrypted');

      // Verify the submit payload is displayed after submit
      cy.get('[data-testid="debug-payload"]')
        .should('be.visible')
        .and('contain.text', 'Last Submit Payload:')
        .and('contain.text', '"password": "secretpassword"')
        .and('contain.text', '"docType": "L014"')
        .and('contain.text', '"docType": "L029"')
        .and('contain.text', '"file": {}') // File objects serialize as empty objects
        .and('contain.text', '"fileMetadata"') // But we include serializable metadata
        .and('contain.text', '"name": "regular-document.pdf"')
        .and('contain.text', '"name": "encrypted-document.pdf"')
        .and('contain.text', '"type": "application/pdf"');

      cy.axeCheck();
    });
  });
});
