// TDD E2E Tests for VA File Input Multiple Component
describe('VA File Input Multiple - TDD E2E Tests', () => {
  // Helper function to set up test environment with our component
  const setupComponentTest = () => {
    // Login and navigate to claims page where component is temporarily added
    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
  };

  // Helper function to click submit button
  const clickSubmitButton = () => {
    cy.get('va-button[text="Submit documents for review"]')
      .shadow()
      .find('button')
      .click();
  };

  // Helper function to find error element in shadow DOM
  const getErrorElement = () => {
    return cy
      .get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('#error-message, .usa-error-message, [role="alert"]');
  };

  // Helper function to upload a file to the first file input
  const uploadFile = (fileName, fileIndex = 0) => {
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex)
      .shadow()
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName,
      });
  };

  // Helper function to upload an encrypted PDF
  const uploadEncryptedPDF = (fileName, fileIndex = 0) => {
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex)
      .shadow()
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('%PDF-1.4\n/Encrypt\nsome content'),
        fileName,
        mimeType: 'application/pdf',
      });
  };

  // Helper function to get file input at specific index
  const getFileInput = (fileIndex = 0) => {
    return cy
      .get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .eq(fileIndex)
      .shadow();
  };

  // Helper function to get error message for a file
  const getFileError = (fileIndex = 0) => {
    return getFileInput(fileIndex).find('#input-error-message');
  };

  // Helper function to verify password error appears
  const verifyPasswordError = (fileIndex = 0) => {
    getFileError(fileIndex)
      .should('be.visible')
      .and('contain.text', 'Please provide a password to decrypt this file');
  };

  // Helper function to verify no error exists for a file
  const verifyNoError = (fileIndex = 0) => {
    getFileError(fileIndex).should('not.exist');
  };

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
    it('should show error message when submit clicked without files', () => {
      setupComponentTest();

      // Click submit without selecting any files
      clickSubmitButton();

      // Verify error message appears in the file input shadow DOM
      // Note: Web component content may not be visible in Cypress UI but tests work correctly
      // To debug visually, add .then(() => cy.pause()) after this assertion
      getErrorElement()
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
      getErrorElement().should('contain.text', 'Please select a file first');

      // Add a file
      uploadFile(fileName);

      // Verify error is cleared after adding file
      getErrorElement().should('not.exist');

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
      verifyPasswordError(0);

      cy.axeCheck();
    });
  });

  describe('User Story #8: Error persistence when adding files', () => {
    it('should persist validation errors when adding another file', () => {
      setupComponentTest();

      // Upload encrypted file and wait for password input
      setupEncryptedFile('encrypted-document.pdf');

      // Submit without entering password to trigger error
      clickSubmitButton();
      verifyPasswordError(0);

      // Add another file (should not clear the existing error)
      uploadFile('second-regular.pdf', 1);

      // Verify the original error still persists after adding another file
      verifyPasswordError(0);

      // Verify the second file has no error
      verifyNoError(1);

      cy.axeCheck();
    });
  });

  describe('User Story#9: Error clearing behavior', () => {
    it('should clear password error when password is entered', () => {
      setupComponentTest();

      // Upload encrypted file and wait for password input
      setupEncryptedFile('encrypted-document.pdf');

      // Submit without entering password to trigger error
      clickSubmitButton();
      verifyPasswordError(0);

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

  describe('Bug: Error transfer when file is deleted', () => {
    it('should not transfer errors to other files when a file is deleted', () => {
      setupComponentTest();

      // Upload first encrypted PDF file and wait for password input
      setupEncryptedFile('first-encrypted.pdf');

      // Upload second regular file
      uploadFile('second-regular.pdf', 1);

      // Submit without entering password for first file to trigger error
      clickSubmitButton();
      verifyPasswordError(0);
      verifyNoError(1);

      // Delete the first file (the one with the error)
      getFileInput(0)
        .find('va-button-icon[aria-label*="delete"]')
        .shadow()
        .find('button')
        .click();

      // Confirm deletion in modal
      getFileInput(0)
        .find('va-modal')
        .shadow()
        .find('button.usa-button')
        .first()
        .click();

      // Bug test: Verify the error does NOT transfer to the remaining file
      verifyNoError(0); // This is now the second file that moved to first position

      // Verify the correct file name is still displayed
      getFileInput(0).should('contain.text', 'second-regular.pdf');

      cy.axeCheck();
    });
  });
});
