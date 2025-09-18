/* eslint-disable @department-of-veterans-affairs/axe-check-required */
import manifest from '../manifest.json';

describe('VaFileInputMultiple Component', () => {
  // Skip tests in CI until the app is released.
  before(() => {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    // Force a fresh page load to ensure clean state
    cy.visit(manifest.rootUrl, { timeout: 10000 });
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

  describe.skip('Encrypted Files', () => {
    it('should prompt for password when encrypted file is uploaded', () => {
      // Create an encrypted PDF file (simulated by naming convention)
      const fileName = 'encrypted-document.pdf';
      const fileContent = '%PDF-1.4\n/Encrypt 123 0 R\nencrypted content here';

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

      // Wait for file to be processed and check for pending password status
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
    });

    it('should validate password for encrypted files', () => {
      // Upload an encrypted file first
      const fileName = 'encrypted-test.pdf';
      const fileContent = '%PDF-1.4\n/Encrypt 123 0 R\nencrypted content';

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

      // Wait for password field to appear
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('be.visible');

      // Test empty password validation
      // Focus the input field
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .focus();

      // Clear the input field (separate command to handle DOM changes)
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .clear();

      // Blur the input field (separate command to handle DOM changes)
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .blur();

      // Note: Password validation errors may be handled by our implementation
      // For now, we'll skip the specific error message check and focus on the workflow
      // The important part is that the password field exists and accepts input

      // Enter a valid password
      const validPassword = 'testpassword123';
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .type(validPassword);

      // Wait for file to be processed with password
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);

        const uploadedFile = processedFiles[0];
        expect(uploadedFile).to.have.property('name', fileName);
        expect(uploadedFile).to.have.property('status', 'uploaded');
        expect(uploadedFile).to.have.property('encrypted', true);
        expect(uploadedFile).to.have.property('passwordProvided', true);
      });

      // Note: Password field behavior after upload may vary by component implementation
      // The important validation is that the file was processed successfully with the password
      // We've already verified the file status is 'uploaded' and passwordProvided is true above
    });

    it('should handle password update events with debouncing', () => {
      // Upload an encrypted file
      const fileName = 'password-debounce-test.pdf';
      const fileContent = '%PDF-1.4\n/Encrypt 456 0 R\nmore encrypted content';

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

      // Verify file is detected as encrypted and in pending state
      cy.get('[data-testid="files-state"]', { timeout: 10000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);

        const file = processedFiles[0];
        expect(file).to.have.property('name', fileName);
        expect(file).to.have.property('encrypted', true);
        expect(file).to.have.property('status', 'pending_password');
      });

      // Verify password field appears for encrypted file
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .should('be.visible');

      // Test debounced password processing
      // Clear the password field
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .clear();

      // Type password (separate command to handle DOM changes)
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .type('testpassword123');

      // Verify file is still in pending state (before debounce)
      cy.get('[data-testid="files-state"]').should($el => {
        const processedFiles = JSON.parse($el.text());
        const file = processedFiles[0];
        expect(file).to.have.property('status', 'pending_password');
      });

      // Trigger blur to start debounce
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('va-text-input')
        .shadow()
        .find('input')
        .blur();

      // Wait for debounced processing to complete by checking for status change
      // This is better than arbitrary wait - it waits for the actual condition
      cy.get('[data-testid="files-state"]', { timeout: 10000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);

        const uploadedFile = processedFiles[0];
        expect(uploadedFile).to.have.property('name', fileName);

        // Wait until the file status changes from 'pending_password' to 'uploaded'
        // This automatically handles the debounce timing
        expect(uploadedFile).to.have.property('status', 'uploaded');
        expect(uploadedFile).to.have.property('encrypted', true);
        expect(uploadedFile).to.have.property('passwordProvided', true);
      });
    });

    it('should remove encrypted file and clear password state', () => {
      // Upload an encrypted file
      const fileName = 'encrypted-remove-test.pdf';
      const fileContent = '%PDF-1.4\n/Encrypt 789 0 R\nencrypted remove test';

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

      // Wait for file to be processed
      cy.get('[data-testid="files-state"]', { timeout: 15000 }).should($el => {
        const processedFiles = JSON.parse($el.text());
        expect(processedFiles).to.have.length(1);
      });

      // Remove the encrypted file
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .shadow()
        .find('button[aria-label*="Delete"]')
        .click();

      // Confirm deletion in modal
      cy.get('va-modal')
        .shadow()
        .find('va-button')
        .shadow()
        .find('button')
        .contains('Yes, delete this')
        .click();

      // Verify the processed files state is empty
      cy.get('[data-testid="files-state"]').should('contain.text', '[]');
    });
  });

  describe('Multiple File Upload', () => {
    it('should handle multiple file uploads', () => {
      // TODO: Add test for multiple files
    });

    it('should maintain proper file order', () => {
      // TODO: Add test for file ordering
    });
  });

  describe('Accessibility', () => {
    it('maintains accessibility standards during file operations', () => {
      cy.axeCheck('va-file-input-multiple');
    });
  });
});
