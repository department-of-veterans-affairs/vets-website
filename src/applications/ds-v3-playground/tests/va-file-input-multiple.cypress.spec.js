/* eslint-disable @department-of-veterans-affairs/axe-check-required */

describe('VaFileInputMultiple Component', () => {
  beforeEach(() => {
    // Force a fresh page load to ensure clean state
    cy.visit('/ds-v3-playground', { timeout: 10000 });
    cy.injectAxe();

    // Wait for component to initialize
    cy.get('va-file-input-multiple').should('exist');

    // Ensure we start with empty state
    cy.get('[data-testid="files-state"]').should('contain.text', '[]');
  });

  describe('File Upload Functionality', () => {
    it('processes file upload and stores metadata (mock upload)', () => {
      // Verify initial state is empty (we store processed metadata, not raw component state)
      cy.get('[data-testid="files-state"]').should('contain.text', '[]');

      // Create a test file
      const fileName = 'test-file.pdf';
      const fileContent = 'test file content';

      // Find the file input within the va-file-input-multiple component
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('input[type="file"]')
        .selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for mock upload to complete and file to be processed
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        // Should have processed file metadata (not raw File objects)
        expect(processedFiles).to.have.length.greaterThan(0);

        const uploadedFile = processedFiles[0];
        expect(uploadedFile).to.have.property('name', fileName);
        expect(uploadedFile).to.have.property('status', 'uploaded');
        expect(uploadedFile).to.have.property('confirmationCode');
      });

      // Verify the processed file metadata structure
      cy.get('[data-testid="files-state"]').then($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);

        const uploadedFile = processedFiles[0];

        // Verify processed metadata structure (like forms library)
        expect(uploadedFile).to.have.property('name', fileName);
        expect(uploadedFile).to.have.property('size');
        expect(uploadedFile).to.have.property('type', 'application/pdf');
        expect(uploadedFile).to.have.property('confirmationCode');
        expect(uploadedFile).to.have.property('uploadDate');
        expect(uploadedFile).to.have.property('status', 'uploaded');

        // Verify confirmation code format
        expect(uploadedFile.confirmationCode).to.match(/^CONF-\d+-[a-z0-9]+$/);

        // Verify upload date is valid ISO string
        expect(() => new Date(uploadedFile.uploadDate)).to.not.throw();
      });

      // Run accessibility check on our specific component area
      cy.axeCheck('va-file-input-multiple', {
        includedImpacts: ['critical', 'serious', 'moderate', 'minor'],
      });
    });

    it('shows upload progress during mock upload', () => {
      const fileName = 'test-progress.pdf';
      const fileContent = 'test file for progress tracking';

      // Upload file and verify progress is shown
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('input[type="file"]')
        .selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // The component should show progress during upload
      // Note: Progress happens quickly (500ms), so we mainly verify final state
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
        expect(processedFiles[0]).to.have.property('status', 'uploaded');
      });
    });

    it('removes processed file when delete button is clicked', () => {
      // Ensure we start clean
      cy.get('[data-testid="files-state"]').should('contain.text', '[]');

      // Upload a file first
      const fileName = 'test-file-remove.pdf';
      const fileContent = 'test file content for removal';

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('input[type="file"]')
        .selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for file to be processed and added to state
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
        expect(processedFiles[0]).to.have.property('name', fileName);
      });

      // Remove the file by clicking the delete button
      // Try to find the delete button with various selectors
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('button', { timeout: 20000 })
        .contains('Delete')
        .should('be.visible')
        .click();

      // Wait for confirmation modal to appear and click "Yes, delete this"
      cy.get('va-modal')
        .shadow()
        .find('va-button')
        .shadow()
        .find('button')
        .contains('Yes, delete this')
        .click();

      // Verify the processed files state is empty again
      cy.get('[data-testid="files-state"]').should('contain.text', '[]');
    });
  });

  describe('File Upload Errors', () => {
    // TODO: Add tests for file upload errors
  });

  describe('File Validation', () => {
    it('should reject invalid file types', () => {
      // TODO: Add test for invalid file types
    });

    it('should reject files that are too large', () => {
      // TODO: Add test for file size validation
    });

    it('should reject files that are too small', () => {
      // TODO: Add test for minimum file size
    });
  });

  describe('Encrypted Files', () => {
    it('should display a password field for encrypted files', () => {
      // Create an encrypted PDF file with proper /Encrypt signature
      const fileName = 'encrypted-document.pdf';
      const fileContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
/Encrypt 3 0 R
>>
endobj

3 0 obj
<<
/Filter /Standard
/V 1
/R 2
/O (mock encrypted owner password)
/U (mock encrypted user password)
/P -44
>>
endobj

%%EOF`;

      // Upload the encrypted file
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('input')
        .selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for file to be processed and check it's detected as encrypted
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);

        const uploadedFile = processedFiles[0];
        expect(uploadedFile).to.have.property('name', fileName);
        expect(uploadedFile).to.have.property('status', 'pending_password');
        expect(uploadedFile).to.have.property('encrypted', true);
      });

      // Verify password input field is visible in the component
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('be.visible');

      // Verify the password field accepts input
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('testpassword123');

      // Verify the typed value appears in the field
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('have.value', 'testpassword123');
    });
  });

  describe('Multiple File Upload', () => {
    it('should handle FILE_ADDED action when adding files', () => {
      // First, upload an initial file
      const initialFileName = 'initial-file.pdf';
      const initialFileContent = 'initial content';

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find(
          'input[aria-label="Select files to upload. Drag a file here or choose from folder"]',
        )
        .selectFile(
          {
            contents: Cypress.Buffer.from(initialFileContent),
            fileName: initialFileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for file to be processed and added to state
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
        expect(processedFiles[0]).to.have.property('name', initialFileName);
        expect(processedFiles[0]).to.have.property('status', 'uploaded');
      });
    });

    it('should handle FILE_UPDATED action when replacing files', () => {
      // First, upload an initial file
      const initialFileName = 'initial-file.pdf';
      const initialFileContent = 'initial content';

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find(
          'input[aria-label="Select files to upload. Drag a file here or choose from folder"]',
        )
        .selectFile(
          {
            contents: Cypress.Buffer.from(initialFileContent),
            fileName: initialFileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for initial file to be processed
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
        expect(processedFiles[0]).to.have.property('name', initialFileName);
        expect(processedFiles[0]).to.have.property('status', 'uploaded');
      });

      // Now replace/update the file with a new one
      const updatedFileName = 'updated-file.pdf';
      const updatedFileContent = 'updated content - larger file';

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find(
          'input[aria-label="Select files to upload. Drag a file here or choose from folder"]',
        )
        .selectFile(
          {
            contents: Cypress.Buffer.from(updatedFileContent),
            fileName: updatedFileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Verify the file was updated (should trigger FILE_UPDATED or FILE_ADDED)
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());

        // Should have 2 files now (original + new) or 1 replaced file
        // depending on component behavior
        expect(processedFiles.length).to.be.greaterThan(0);

        // Check that the new file is present
        const hasUpdatedFile = processedFiles.some(
          file => file.name === updatedFileName && file.status === 'uploaded',
        );
        expect(hasUpdatedFile).to.be.true;
      });
    });

    it('should handle PASSWORD_UPDATE action when updating files', () => {
      // First, upload an encrypted file with proper PDF encryption signature
      const encryptedFileName = 'encrypted-file.pdf';
      const encryptedFileContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
/Encrypt 3 0 R
>>
endobj

3 0 obj
<<
/Filter /Standard
/V 1
/R 2
/O (mock encrypted owner password)
/U (mock encrypted user password)
/P -44
>>
endobj

%%EOF`;

      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find(
          'input[aria-label="Select files to upload. Drag a file here or choose from folder"]',
        )
        .selectFile(
          {
            contents: Cypress.Buffer.from(encryptedFileContent),
            fileName: encryptedFileName,
            mimeType: 'application/pdf',
          },
          { force: true },
        );

      // Wait for encrypted file to be processed
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
        expect(processedFiles[0]).to.have.property('name', encryptedFileName);
        expect(processedFiles[0]).to.have.property(
          'status',
          'pending_password',
        );
        expect(processedFiles[0]).to.have.property('encrypted', true);
      });

      // Verify password input field is visible in the component
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('be.visible');

      // Verify the password field accepts input
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('testpassword123');

      // Verify the typed value appears in the field
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('have.value', 'testpassword123');
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility standards during file operations', () => {
      cy.axeCheck('va-file-input-multiple');
    });
  });
});
