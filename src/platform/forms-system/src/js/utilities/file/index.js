import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const checkForEncryptedPdf = file =>
  new Promise((resolve, reject) => {
    if (file.name.endsWith('pdf')) {
      const reader = new FileReader();
      reader.onloadend = event => {
        if (event.target.readyState === FileReader.DONE) {
          // const { result } = event.target // with readAsBinaryString
          const result = Array.from(new Int8Array(event.target.result))
            .map(v => String.fromCharCode(v))
            .join('');
          if (result.includes('/Encrypt')) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      };
      try {
        // "/Encrypt" is within the first 200 bytes of the PDF
        const blob = file.slice(0, 200);
        // TODO: once we stop supporting IE11, update this and replace the
        // readAsArrayBuffer and Int8Array conversion in the code with a string
        // compare using readAsBinaryString (which isn't supported by IE11)
        reader.readAsArrayBuffer(blob);
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(false);
    }
  });

// Feature toggle
export const getRequestLockedPdfPassword = state =>
  toggleValues(state).request_locked_pdf_password;
