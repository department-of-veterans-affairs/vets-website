export default function checkForEncryptedPdf(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = event => {
      // const { result } = event.target // with readAsBinaryString
      const result = Array.from(new Int8Array(event.target.result))
        .map(v => String.fromCharCode(v))
        .join('');
      if (result.includes('/Encrypt')) {
        resolve(true);
        return;
      }
      resolve(false);
    };
    // "/Encrypt" string is within the first 200 bytes of the PDF
    const blob = file.slice(0, 200);
    // TODO: once we stop supporting IE11, update this and replace the
    // readAsArrayBuffer and Int8Array conversion in the code with a string
    // compare using readAsBinaryString (which isn't supported by IE11)
    reader.readAsArrayBuffer(blob);
  });
}
