const BINARY_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function checkUTF8Encoding({ file }) {
  return new Promise((resolve, reject) => {
    if (BINARY_FILE_TYPES.includes(file.type)) {
      resolve(true);
      return;
    }

    const decoder = new TextDecoder('utf-8', { fatal: true });
    const reader = new FileReader();

    reader.onload = event => {
      try {
        decoder.decode(event.target.result);
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    };
    reader.onerror = error => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
}
