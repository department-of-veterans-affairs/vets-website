// TDD E2E Tests for VA File Input Multiple Component
describe('VA File Input Multiple - TDD E2E Tests', () => {
  // Helper function to set up test environment with our component
  const setupComponentTest = () => {
    // Login and navigate to claims page where component is temporarily added
    cy.login();
    cy.visit('/track-claims');
    cy.injectAxe();
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
      cy.get('va-file-input-multiple')
        .shadow()
        .find('va-file-input')
        .first()
        .shadow()
        .find('input[type="file"]')
        .selectFile({
          contents: Cypress.Buffer.from('test content'),
          fileName: clickFile,
        });

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
});
