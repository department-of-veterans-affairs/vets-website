// Client-side PDF password validation using pdfjs-dist.
// Validates if the provided password can decrypt the first page of the PDF.
// Does NOT return or persist decrypted content; destroys references ASAP.
// Returns a promise that resolves to { valid: boolean, error?: string }.

/* eslint-disable no-console */
export async function validatePdfPassword(
  file,
  password,
  { pdfjs: injectedPdfjs = null, skipImport = false } = {},
) {
  if (!file || !password) {
    return { valid: false, error: 'Password required' };
  }

  // If pdfjs is injected (test / DI) use it directly
  let pdfjs = injectedPdfjs;

  // In Node (no DOM) or when explicitly skipped, bail early – backend will handle
  const noDom =
    typeof document === 'undefined' || typeof window === 'undefined';
  if (!pdfjs && (skipImport || noDom)) {
    return { valid: true, skipped: true };
  }

  if (!pdfjs) {
    try {
      // Use legacy build for broader compatibility (matches existing test usage)
      pdfjs = await import(/* webpackChunkName: "pdfjs-dist-legacy" */ 'pdfjs-dist/legacy/build/pdf');
    } catch (e) {
      // If pdfjs cannot be loaded, fall back to allowing backend to validate
      console.warn(
        'PDF.js failed to load for password validation; skipping client validation.',
        e,
      );
      return { valid: true, skipped: true };
    }
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjs.getDocument({ data: arrayBuffer, password });
    const pdfDocument = await loadingTask.promise;

    // Attempt to access first page to ensure full decryption; if password wrong it will throw earlier
    await pdfDocument.getPage(1);

    // Clean up
    if (pdfDocument && pdfDocument.destroy) {
      pdfDocument.destroy();
    }

    return { valid: true };
  } catch (error) {
    // pdf.js uses specific error names for password issues
    if (
      error &&
      (error.name === 'PasswordException' || /password/i.test(error.message))
    ) {
      return { valid: false, error: 'Incorrect password' };
    }
    console.warn(
      'PDF password validation failed; deferring to backend.',
      error,
    );
    return { valid: true, skipped: true };
  }
}

export default validatePdfPassword;
