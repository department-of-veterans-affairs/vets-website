/**
 * Cypress helper commands for va-file-input and va-file-input-multiple.
 *
 * Contains both the low-level fill commands (fillVaFileInput,
 * fillVaFileInputMultiple) and higher-level assertion/interaction helpers
 * (delete, error checking, encrypted PDF unlock, additional info, etc.).
 *
 * Naming convention: every command contains either "VaFileInput" or
 * "VaFileInputMultiple" so callers can quickly see which component it
 * targets.
 */
import { makeMinimalPNG } from '../form-tester/utilities';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Generate an object with file contents suitable for Cypress selectFile.
 * @param {File} file
 * @returns {Promise<{contents: Buffer, fileName: string, mimeType: string, lastModified: number}>}
 */
async function getFileContents(file) {
  return {
    contents: Cypress.Buffer.from(await file.arrayBuffer()),
    fileName: file.name || 'placeholder.png',
    mimeType: file.type || 'image/png',
    lastModified: file.lastModified || Date.now(),
  };
}

/**
 * Resolve a va-file-input element from a field name or the first on the page.
 * @param {string} [field] - The `name` attribute value, or omit for the first
 *   va-file-input on the page.
 * @returns Cypress chainable wrapping the element.
 */
function getVaFileInputEl(field) {
  return field
    ? cy.get(`va-file-input[name="${field}"]`)
    : cy.get('va-file-input');
}

/**
 * Resolve a child va-file-input inside a va-file-input-multiple.
 * @param {string} [field] - The `name` attribute of the parent, or omit for
 *   the first va-file-input-multiple on the page.
 * @param {number} [index=0] - Which child file-input to target.
 * @returns Cypress chainable wrapping the child va-file-input.
 */
function getVaFileInputMultipleChild(field, index = 0) {
  const parent = field
    ? cy.get(`va-file-input-multiple[name="${field}"]`)
    : cy.get('va-file-input-multiple');
  return parent
    .shadow()
    .find('va-file-input')
    .eq(index);
}

// ---------------------------------------------------------------------------
// va-file-input fill commands
// ---------------------------------------------------------------------------

Cypress.Commands.add('fillVaFileInput', (field, value, file) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-file-input[name="${field}"]`)
        : cy.wrap(field);

    element.then(async $el => {
      const el = $el[0];

      return cy.then(() => file || makeMinimalPNG()).then(async mockFile => {
        const selectFileArg = await getFileContents(mockFile);

        // Capture the native <input> reference before selectFile so we
        // can inspect input.files afterward without unsafely chaining
        // off selectFile's yielded subject.
        let input;
        cy.wrap(el)
          .shadow()
          .find('input[type="file"]')
          .then($input => {
            [input] = $input;
          })
          .selectFile(selectFileArg, { force: true });

        cy.then(() => {
          // Stencil's native change handler is async (microtask-batched),
          // so we must wait for its render cycle to complete before
          // checking whether it processed the file. Checking
          // synchronously here would always miss the result and
          // incorrectly trigger the fallback, which re-processes the
          // file through a different code path (el.value) that can
          // produce different error messages (e.g. "too small" instead
          // of "empty" for 0-byte files).
          return new Cypress.Promise(resolve => {
            // eslint-disable-next-line no-inner-declarations
            function attemptFallbackIfNeeded() {
              const fileCardRendered = !!el.shadowRoot.querySelector(
                '.selected-files-wrapper, .headless-selected-files-wrapper',
              );
              const hasErrorAlready = !!el.shadowRoot.querySelector(
                '.usa-error-message',
              );

              // Stencil's native handler already processed the file -
              // no fallback needed.
              if (fileCardRendered || hasErrorAlready) {
                resolve();
                return;
              }

              // Stencil 4.x vDOM may not catch synthetic change events
              // from Cypress selectFile on inputs inside nested shadow
              // DOM. Fall back to:
              // 1. Setting the value prop to trigger the web component's
              //    own handleFile validation (runs on next render cycle
              //    via componentWillRender).
              // 2. Emitting vaMultipleChange (headless inside parent)
              //    or vaChange (standalone) so React processes the file.
              if (input.files && input.files.length > 0) {
                const selectedFile = input.files[0];

                // Trigger the web component's internal file processing.
                // handleValueChange watcher calls handleFile which
                // validates the file, sets this.file, and renders the
                // file card.
                el.value = selectedFile;

                // Find the parent va-file-input-multiple. el.closest()
                // can't cross shadow DOM boundaries, so we use
                // getRootNode().host.
                const rootNode = el.getRootNode();
                const parentMultiple =
                  rootNode?.host?.tagName === 'VA-FILE-INPUT-MULTIPLE'
                    ? rootNode.host
                    : null;

                if (parentMultiple) {
                  // Determine the page index of this child within the
                  // parent
                  const children = Array.from(
                    parentMultiple.shadowRoot.querySelectorAll('va-file-input'),
                  );
                  const pageIndex = children.indexOf(el);

                  parentMultiple.dispatchEvent(
                    new CustomEvent('vaMultipleChange', {
                      detail: {
                        action: 'FILE_ADDED',
                        file: selectedFile,
                        state: [{ file: selectedFile, changed: true }],
                        index: pageIndex >= 0 ? pageIndex : 0,
                      },
                      bubbles: true,
                      composed: true,
                    }),
                  );
                } else {
                  // Standalone va-file-input - emit vaChange on the
                  // element
                  el.dispatchEvent(
                    new CustomEvent('vaChange', {
                      detail: { files: [selectedFile] },
                      bubbles: true,
                      composed: true,
                    }),
                  );
                }
              }

              resolve();
            }

            // Wait for Stencil's async render cycle to flush before
            // deciding whether the native handler fired.
            // requestAnimationFrame fires after microtasks (where
            // Stencil batches state updates) and before the next paint.
            requestAnimationFrame(() => {
              attemptFallbackIfNeeded();
            });
          });
        });

        // Wait for file processing to complete.
        //
        // The web component renders a card with .file-size-label immediately
        // when a file is selected (from the native File object). But React
        // hasn't processed the event yet - it needs to run the async
        // handleVaChange, call getFileError, then either:
        //   - start simulateUploadSingle (skipUpload: true)
        //   - call handleUpload (skipUpload: false)
        //   - set error state
        //   - set encrypted state
        //
        // We CANNOT rely on .file-size-label or .uploading-status alone
        // because there's a race between the web component's immediate
        // render and React's async processing.
        //
        // Instead, we wait for one of these React-driven outcomes:
        // 1. uploadedFile prop is set (upload complete)
        //    - For standalone va-file-input: plain object from formData
        //    - For va-file-input inside va-file-input-multiple: File
        //      instance distributed by parent from uploadedFiles array
        // 2. .uploading-status appears then disappears (upload cycle)
        // 3. Error in shadow DOM from React (setError -> re-render)
        // 4. Password field appears (encrypted detection)
        let sawUploading = false;
        return cy.wrap(el, { timeout: 5000 }).should(() => {
          const isUploading = el.shadowRoot.querySelector('.uploading-status');
          const hasError = el.shadowRoot.querySelector('.usa-error-message');
          const isEncrypted = el.shadowRoot.querySelector(
            '.password-input-section',
          );

          // uploadedFile can be a plain object (single input) or a File
          // instance (multi input via parent distribution). Use truthiness
          // instead of Object.keys() which returns [] for File objects.
          const hasUploadedFile = !!el.uploadedFile;

          // Check parent's uploadedFiles if this is a headless child.
          // el.closest() can't cross shadow DOM boundaries, so use
          // getRootNode().host to find the parent va-file-input-multiple.
          let parentHasUploaded = false;
          if (el.headless) {
            const rootNode = el.getRootNode();
            const parent =
              rootNode?.host?.tagName === 'VA-FILE-INPUT-MULTIPLE'
                ? rootNode.host
                : null;
            if (parent && parent.uploadedFiles) {
              parentHasUploaded = parent.uploadedFiles.some(f => !!f);
            }
          }

          // Track if we ever saw uploading status
          if (isUploading) {
            sawUploading = true;
          }

          // Still uploading - keep retrying
          if (isUploading) {
            throw new Error('Upload still in progress.');
          }

          // Error or encrypted - React has processed the file
          if (hasError || isEncrypted) {
            return;
          }

          // uploadedFile set - upload is truly complete
          if (hasUploadedFile) {
            return;
          }

          // Parent has uploaded files (headless mode)
          if (parentHasUploaded) {
            return;
          }

          // We saw uploading and now it's gone - upload completed
          if (sawUploading) {
            return;
          }

          // None of the above - React hasn't processed the file yet
          throw new Error('Waiting for React to process file.');
        });
      });
    });
  }
});

Cypress.Commands.add('fillVaFileInputMultiple', (field, value, files) => {
  if (typeof value !== 'undefined') {
    const element =
      typeof field === 'string'
        ? cy.get(`va-file-input-multiple[name="${field}"]`)
        : cy.wrap(field);

    element.then(async $el => {
      const el = $el[0];
      // get number of previously added files
      const startingIndex =
        el.shadowRoot.querySelectorAll('va-file-input').length - 1;
      const filesPromise = Array.isArray(files)
        ? Promise.resolve(files)
        : makeMinimalPNG().then(f => [f]);

      cy.wrap(filesPromise).then(_files => {
        _files.forEach((f, index) => {
          cy.wrap(el)
            .shadow()
            .find('va-file-input')
            .eq(startingIndex + index)
            .then($fileInput => {
              cy.fillVaFileInput($fileInput, value, f);
            });
        });
      });
    });
  }
});

// ---------------------------------------------------------------------------
// va-file-input assertion / interaction helpers
// ---------------------------------------------------------------------------

/**
 * Delete the first uploaded file from a va-file-input and confirm the
 * removal modal.
 *
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add('deleteVaFileInput', (field = undefined) => {
  getVaFileInputEl(field)
    .find('va-button-icon')
    .then($el => {
      if ($el.length > 1) {
        $el[1].click();
        cy.get('va-modal')
          .shadow()
          .find('va-button')
          .then($el2 => {
            if ($el2.length > 0) {
              $el2[0].click();
            }
          });
      }
    });
});

/**
 * Assert that a va-file-input is showing an error that matches the given
 * pattern.  Checks both the `error` attribute and the shadow-DOM
 * `.usa-error-message` span so callers don't have to know which path the
 * component uses for a given error type.
 *
 * @param {string|RegExp} errorPattern - A string (partial match) or RegExp.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputError',
  (errorPattern, field = undefined) => {
    // Use .should() for Cypress retry logic - the error may not have
    // rendered yet when this runs.
    getVaFileInputEl(field).should($el => {
      const attrError = $el.attr('error') || '';
      const shadowErrorEl = $el[0].shadowRoot?.querySelector(
        '.usa-error-message',
      );
      const shadowError = shadowErrorEl ? shadowErrorEl.textContent : '';
      const combined = `${attrError} ${shadowError}`;

      if (errorPattern instanceof RegExp) {
        expect(combined).to.match(errorPattern);
      } else {
        expect(combined).to.contain(errorPattern);
      }
    });
  },
);

/**
 * Assert that a va-file-input is showing the "File is required."
 * validation error.  The caller is responsible for triggering validation
 * (e.g. clicking "Continue") before calling this helper.
 *
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add('expectVaFileInputRequired', (field = undefined) => {
  getVaFileInputEl(field)
    .shadow()
    .find('span.usa-error-message')
    .should('contain', 'File is required.');
});

// -- Named error helpers (va-file-input) --

/**
 * Assert the "too big" error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add('expectVaFileInputErrorTooBig', (field = undefined) => {
  cy.expectVaFileInputError(
    /We can.t upload your file because it.s too big/i,
    field,
  );
});

/**
 * Assert the "too small" error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add('expectVaFileInputErrorTooSmall', (field = undefined) => {
  cy.expectVaFileInputError(
    /We can.t upload your file because it.s too small/i,
    field,
  );
});

/**
 * Assert the "empty file" error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add('expectVaFileInputErrorEmpty', (field = undefined) => {
  cy.expectVaFileInputError(/The file you selected is empty/i, field);
});

/**
 * Assert the MIME-type mismatch error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputErrorMimeTypeMismatch',
  (field = undefined) => {
    cy.expectVaFileInputError(
      /The file extension doesn.t match the file format/i,
      field,
    );
  },
);

/**
 * Assert the invalid encoding error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputErrorInvalidEncoding',
  (field = undefined) => {
    cy.expectVaFileInputError(/The file.s encoding is not valid/i, field);
  },
);

/**
 * Assert the "not accepted" file type error on a va-file-input.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputErrorFileNotAccepted',
  (field = undefined) => {
    cy.expectVaFileInputError(/We do not accept .* files/i, field);
  },
);

/**
 * Assert that a file was successfully uploaded and the card is showing the
 * expected filename.
 *
 * @param {string} fileName - The file name to look for.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputUploadSuccess',
  (fileName, field = undefined) => {
    getVaFileInputEl(field)
      .shadow()
      .find('va-card')
      .find('span.file-label')
      .should('exist')
      .and('contain', fileName);
  },
);

/**
 * Handle the encrypted-PDF unlock flow on a va-file-input.
 * Assumes an encrypted PDF has already been uploaded.
 *
 * @param {string} password - The password to enter.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'unlockVaFileInputEncryptedPdf',
  (password, field = undefined) => {
    getVaFileInputEl(field)
      .find('va-alert')
      .shadow()
      .find('p.password-alert-text')
      .should('contain', /We can't open your file without its password./i);

    getVaFileInputEl(field)
      .find('va-text-input')
      .then($el => {
        cy.fillVaTextInput($el, password);
      });

    getVaFileInputEl(field)
      .find('va-button')
      .click();

    getVaFileInputEl(field)
      .find('va-alert')
      .shadow()
      .find('p.password-alert-text')
      .should('contain', /File successfully unlocked/i);
  },
);

/**
 * Upload an encrypted PDF to a va-file-input, enter the password, and
 * confirm it is unlocked.
 *
 * @param {string} field - The `name` attribute selector (or element).
 * @param {File} file - The encrypted PDF File object.
 * @param {string} password - The password to unlock the PDF.
 */
Cypress.Commands.add(
  'fillAndUnlockEncryptedPdfVaFileInput',
  (field, file, password) => {
    cy.fillVaFileInput(field, {}, file);
    cy.unlockVaFileInputEncryptedPdf(
      password,
      typeof field === 'string' ? field : undefined,
    );
  },
);

/**
 * Set the additional-info va-select inside a va-file-input.
 * Waits for the va-select to render before interacting.
 *
 * @param {string} selectValue - The option value to select.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'selectVaFileInputAdditionalInfo',
  (selectValue, field = undefined) => {
    getVaFileInputEl(field)
      .find('va-select')
      .should('exist')
      .then($el => {
        cy.selectVaSelect($el, selectValue);
      });
  },
);

/**
 * Assert that the additional-info va-select inside a va-file-input shows
 * the given error. Waits for the va-select to render before asserting.
 *
 * @param {string} expectedError - The expected error text on the va-select.
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'expectVaFileInputAdditionalInfoError',
  (expectedError, field = undefined) => {
    getVaFileInputEl(field)
      .find('va-select')
      .should('exist')
      .and('have.attr', 'error', expectedError);
  },
);

/**
 * Wait for the additional-info va-select to render inside a va-file-input.
 * Use this before triggering form validation so RJSF registers the
 * va-select as a form field.
 *
 * @param {string} [field] - Optional `name` attribute selector.
 */
Cypress.Commands.add(
  'waitForVaFileInputAdditionalInfo',
  (field = undefined) => {
    getVaFileInputEl(field)
      .find('va-select')
      .should('exist');
  },
);

// ---------------------------------------------------------------------------
// va-file-input-multiple commands
// ---------------------------------------------------------------------------

/**
 * Delete a file from a va-file-input-multiple and confirm the removal modal.
 *
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to target.
 */
Cypress.Commands.add(
  'deleteVaFileInputMultiple',
  (field = undefined, index = 0) => {
    // Capture the current child count before deletion so we can wait for
    // the component to finish re-rendering afterward.
    const parent = field
      ? cy.get(`va-file-input-multiple[name="${field}"]`)
      : cy.get('va-file-input-multiple');

    parent.then($parent => {
      const countBefore = $parent[0].shadowRoot.querySelectorAll(
        'va-file-input',
      ).length;

      getVaFileInputMultipleChild(field, index)
        .find('va-button-icon')
        .then($el => {
          if ($el.length > 1) {
            $el[1].click();
            cy.get('va-modal')
              .shadow()
              .find('va-button')
              .then($el2 => {
                if ($el2.length > 0) {
                  $el2[0].click();
                }
              });
          }
        });

      // Wait for the component to re-render with one fewer child instead
      // of using a hard cy.wait().
      const parentAgain = field
        ? cy.get(`va-file-input-multiple[name="${field}"]`)
        : cy.get('va-file-input-multiple');
      parentAgain.should($p => {
        const countAfter = $p[0].shadowRoot.querySelectorAll('va-file-input')
          .length;
        expect(countAfter).to.be.lessThan(countBefore);
      });
    });
  },
);

/**
 * Assert that a child va-file-input inside a va-file-input-multiple is
 * showing an error that matches the given pattern.
 *
 * Checks the shadow DOM `.usa-error-message` inside the child's va-card,
 * which is where the multiple variant renders error text.
 *
 * @param {string|RegExp} errorPattern - A string (partial match) or RegExp.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleError',
  (errorPattern, field = undefined, index = 0) => {
    getVaFileInputMultipleChild(field, index)
      .shadow()
      .find('va-card')
      .find('span.usa-error-message')
      .invoke('text')
      .should(text => {
        if (errorPattern instanceof RegExp) {
          expect(text).to.match(errorPattern);
        } else {
          expect(text).to.contain(errorPattern);
        }
      });
  },
);

/**
 * Assert that the first child va-file-input inside a
 * va-file-input-multiple is showing the "File is required." validation
 * error.  The caller is responsible for triggering validation
 * (e.g. clicking "Continue") before calling this helper.
 *
 * @param {string} [field] - Optional `name` attribute of the parent.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleRequired',
  (field = undefined) => {
    getVaFileInputMultipleChild(field, 0)
      .shadow()
      .find('span.usa-error-message')
      .should('contain', 'File is required.');
  },
);

// -- Named error helpers (va-file-input-multiple) --

/**
 * Assert the "too big" error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorTooBig',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /We can.t upload your file because it.s too big/i,
      field,
      index,
    );
  },
);

/**
 * Assert the "too small" error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorTooSmall',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /We can.t upload your file because it.s too small/i,
      field,
      index,
    );
  },
);

/**
 * Assert the "empty file" error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorEmpty',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /The file you selected is empty/i,
      field,
      index,
    );
  },
);

/**
 * Assert the MIME-type mismatch error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorMimeTypeMismatch',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /The file extension doesn.t match the file format/i,
      field,
      index,
    );
  },
);

/**
 * Assert the invalid encoding error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorInvalidEncoding',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /The file.s encoding is not valid/i,
      field,
      index,
    );
  },
);

/**
 * Assert the "not accepted" file type error on a va-file-input-multiple child.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleErrorFileNotAccepted',
  (field = undefined, index = 0) => {
    cy.expectVaFileInputMultipleError(
      /We do not accept .* files/i,
      field,
      index,
    );
  },
);

/**
 * Handle the encrypted-PDF unlock flow on the first child va-file-input
 * inside a va-file-input-multiple.
 *
 * Assumes an encrypted PDF has already been uploaded.
 *
 * @param {string} password - The password to enter.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to target.
 */
Cypress.Commands.add(
  'unlockVaFileInputMultipleEncryptedPdf',
  (password, field = undefined, index = 0) => {
    // Wait for the va-alert to appear in the shadow DOM first.
    getVaFileInputMultipleChild(field, index)
      .shadow()
      .find('va-alert')
      .should('exist');

    getVaFileInputMultipleChild(field, index)
      .find('va-alert')
      .shadow()
      .find('p.password-alert-text')
      .should('contain', /We can't open your file without its password./i);

    getVaFileInputMultipleChild(field, index)
      .find('va-text-input')
      .then($el => {
        cy.fillVaTextInput($el, password);
      });

    getVaFileInputMultipleChild(field, index)
      .find('va-button')
      .click();

    getVaFileInputMultipleChild(field, index)
      .find('va-alert')
      .shadow()
      .find('p.password-alert-text')
      .should('contain', /File successfully unlocked/i);
  },
);

/**
 * Upload an encrypted PDF to a va-file-input-multiple, enter the password,
 * and confirm it is unlocked.
 *
 * @param {string} field - The `name` attribute of the parent (or element).
 * @param {File} file - The encrypted PDF File object.
 * @param {string} password - The password to unlock the PDF.
 * @param {number} [index=0] - Which child file-input to target.
 */
Cypress.Commands.add(
  'fillAndUnlockEncryptedPdfVaFileInputMultiple',
  (field, file, password, index = 0) => {
    cy.fillVaFileInputMultiple(field, {}, [file]);
    cy.unlockVaFileInputMultipleEncryptedPdf(
      password,
      typeof field === 'string' ? field : undefined,
      index,
    );
  },
);

/**
 * Set the additional-info va-select inside a child va-file-input of a
 * va-file-input-multiple. Waits for the va-select to render before
 * interacting.
 *
 * @param {string} selectValue - The option value to select.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to target.
 */
Cypress.Commands.add(
  'selectVaFileInputMultipleAdditionalInfo',
  (selectValue, field = undefined, index = 0) => {
    getVaFileInputMultipleChild(field, index)
      .find('va-select')
      .should('exist')
      .then($el => {
        cy.selectVaSelect($el, selectValue);
      });
  },
);

/**
 * Assert that the additional-info va-select inside a child va-file-input of
 * a va-file-input-multiple shows the given error. Waits for the va-select
 * to render before asserting.
 *
 * @param {string} expectedError - The expected error text on the va-select.
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to check.
 */
Cypress.Commands.add(
  'expectVaFileInputMultipleAdditionalInfoError',
  (expectedError, field = undefined, index = 0) => {
    getVaFileInputMultipleChild(field, index)
      .find('va-select')
      .should('exist')
      .and('have.attr', 'error', expectedError);
  },
);

/**
 * Wait for the additional-info va-select to render inside a child
 * va-file-input of a va-file-input-multiple.  Use this before triggering
 * form validation so RJSF registers the va-select as a form field.
 *
 * @param {string} [field] - Optional `name` attribute of the parent.
 * @param {number} [index=0] - Which child file-input to target.
 */
Cypress.Commands.add(
  'waitForVaFileInputMultipleAdditionalInfo',
  (field = undefined, index = 0) => {
    getVaFileInputMultipleChild(field, index)
      .find('va-select')
      .should('exist');
  },
);
