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
  const uploadFile = fileName => {
    cy.get('va-file-input-multiple')
      .shadow()
      .find('va-file-input')
      .first()
      .shadow()
      .find('input[type="file"]')
      .selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName,
      });
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

      // Upload an encrypted PDF file
      // Note: Must contain "/Encrypt" signature for checkIsEncryptedPdf to detect encryption
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from('%PDF-1.4\n/Encrypt\nsome content'),
          fileName: 'encrypted-document.pdf',
          mimeType: 'application/pdf',
        });

      // Verify password input appears and is visible to the user
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
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
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('va-text-input')
        .should('not.exist');

      cy.axeCheck();
    });
  });
});
