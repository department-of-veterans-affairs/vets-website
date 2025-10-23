import arrayIncludesArray from './arrayIncludesArray';

/**
 * Checks if a file is a PDF, then looks for the encrypted PDF signature
 * within the file content. The "/Encrypt" signature is also added to view-only
 * PDFs as well as password-encrypted PDF files
 * @param {Object} file - value from FileReader.onload event.target.files
 * @param {Number[]} result - Array from Uint8Array of the loaded file
 * @returns {Boolean}
 */
export default function checkIsEncryptedPdf({ file, result }) {
  const encryptSig = [...'/Encrypt'].map(str => str.charCodeAt(0));
  return (
    (file.name || '').toLowerCase().endsWith('pdf') &&
    arrayIncludesArray(result, encryptSig)
  );
}
