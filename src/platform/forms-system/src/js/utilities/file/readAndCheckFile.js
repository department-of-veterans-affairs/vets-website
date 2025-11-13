import checkTypeAndExtensionMatches from './checkTypeAndExtensionMatches';
import checkIsEncryptedPdf from './checkIsEncryptedPdf';
import checkUTF8Encoding from './checkUTF8Encoding';

/**
 * Read in first 256 bytes of the selected file to perform various checks before
 * upload
 * @param {Object} file - value from FileReader.onload event.target.files
 * @param {Function[]} checks - functions to run on loaded result
 * @returns {Promise}
 */
export default function readAndCheckFile(file, checks) {
  return new Promise((resolve, reject) => {
    // Don't load file if there's nothing to check
    if (Object.keys(checks).length === 0) {
      resolve({});
    } else {
      const reader = new FileReader();
      reader.onloadend = event => {
        if (event.target.result) {
          // const { result } = event.target // with readAsBinaryString
          const result = Array.from(new Uint8Array(event.target.result));
          (async () => {
            const entries = await Promise.all(
              Object.entries(checks).map(async ([name, fn]) => {
                const value = await fn({ file, result });
                return [name, value];
              }),
            );
            resolve(Object.fromEntries(entries));
          })().catch(reject);
        } else {
          reject(new Error('Unable to get file'));
        }
      };
      // The PDF flags we care about should only show up at the beginning and
      // end of the PDF. Using 512 for the end because one example we used had
      // flags showing up more than 256 bytes before the end of the file
      const fileStart = file.slice(0, 256);
      const fileEnd = file.slice(-512);
      const blob = new Blob([fileStart, fileEnd]);
      // TODO: once we stop supporting IE11, update this and replace the
      // readAsArrayBuffer and Int8Array conversion in the code with a string
      // compare using readAsBinaryString (which isn't supported by IE11)
      reader.readAsArrayBuffer(blob);
    }
  });
}

/**
 * Perform standard checks on any file uploaded
 * @param {File} file
 * @returns {{checkIsEncryptedPdf?: boolean, checkTypeAndExtensionMatches: boolean} | null} Object with check results - whether the pdf is encrypted and if type and extension match
 */
export async function standardFileChecks(file) {
  if (!file) return {};

  const isPdf = 'type' in file && file.type === 'application/pdf';

  const checks = {
    ...(isPdf ? { checkIsEncryptedPdf } : {}),
    checkTypeAndExtensionMatches,
    checkUTF8Encoding,
  };

  return readAndCheckFile(file, checks);
}
