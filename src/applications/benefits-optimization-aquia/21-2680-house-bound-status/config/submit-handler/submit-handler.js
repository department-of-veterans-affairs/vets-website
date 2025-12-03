/**
 * @fileoverview Custom submit handler for VA Form 21-2680
 * @module config/submit-handler
 *
 * This form uses a print-and-upload workflow where the backend immediately
 * returns a PDF blob instead of a JSON response with a claim ID.
 * This custom handler stores the PDF blob for later download from the confirmation page.
 */

/**
 * Custom submit handler for Form 21-2680
 * Handles PDF blob response from the backend and stores it for user download
 *
 * @param {Object} form - The form state object from Redux
 * @param {Object} formConfig - The form configuration
 * @returns {Promise} Resolves when submission is complete
 */
export async function submitForm(form, formConfig) {
  const transformedData = formConfig.transformForSubmit(formConfig, form);

  try {
    // Get CSRF token from localStorage
    const csrfToken = localStorage.getItem('csrfToken');

    // Use fetch directly instead of apiRequest since we need a blob response
    // apiRequest is designed for JSON and doesn't support blob responses
    const response = await fetch(formConfig.submitUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'X-CSRF-Token': csrfToken,
      },
      body: transformedData,
    });

    // The response should be a blob (PDF file)
    if (response.ok) {
      const blob = await response.blob();

      // Store the blob as a data URL so it can be accessed later
      // We'll store it in sessionStorage so the DownloadFormPDF component can access it
      const reader = new FileReader();
      const blobUrl = await new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Store in sessionStorage for access on the confirmation page
      sessionStorage.setItem('form-21-2680-pdf-blob', blobUrl);

      // Return a mock response that looks like a saved claim
      // This allows the confirmation page to render properly
      return {
        data: {
          id: 'pdf-download',
          type: 'saved_claims',
          attributes: {
            confirmationNumber: `21-2680-${Date.now()}`,
            guid: 'pdf-blob', // Special guid to indicate we have a blob
            submittedAt: new Date().toISOString(),
          },
        },
      };
    }
    throw new Error(`Submission failed with status: ${response.status}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Form submission error:', error);
    throw error;
  }
}
