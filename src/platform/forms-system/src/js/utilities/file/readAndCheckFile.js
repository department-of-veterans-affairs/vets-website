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
          resolve(
            Object.keys(checks).reduce(
              (checkResults, checkName) => ({
                ...checkResults,
                [checkName]: checks[checkName]({ file, result }),
              }),
              {},
            ),
          );
        } else {
          reject(new Error('Unable to get file'));
        }
      };
      // The content we need _should_ be within the first 256 bytes of the file
      const blob = file.slice(0, 256);
      // TODO: once we stop supporting IE11, update this and replace the
      // readAsArrayBuffer and Int8Array conversion in the code with a string
      // compare using readAsBinaryString (which isn't supported by IE11)
      reader.readAsArrayBuffer(blob);
    }
  });
}
