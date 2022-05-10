import arrayIncludesArray from './arrayIncludesArray';

export const FILE_TYPE_MISMATCH_ERROR =
  'The file extension doesn’t match the file format. Please choose a different file.';

/* Some parts copied from github.com/sindresorhus/file-type/blob/main/core.js
 * - https://en.wikipedia.org/wiki/File_format#Magic_number
 * - https://en.wikipedia.org/wiki/List_of_file_signatures
 */
export const fileTypeSignatures = {
  // documents
  pdf: {
    sig: '%PDF',
    mime: 'application/pdf',
  },
  txt: {
    sig: '', // no signature for text files
    mime: 'text/plain',
  },
  doc: {
    sig: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
    mime: 'application/msword',
  },
  docx: {
    // ECMA-376 - the content type for relationship parts and the Main Document
    // part (the only required part) must be defined (physically located at
    // `/[Content_Types].xml` in the package):
    sig: '[Content_Types].xml',
    mime:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  rtf: {
    sig: '{\\rtf',
    mime: 'text/rtf',
  },

  // images
  jpg: {
    sig: [0xff, 0xd8, 0xff],
    mime: 'image/jpeg',
  },
  jpeg: {
    sig: [
      0x00,
      0x00,
      0x00,
      0x0c,
      0x6a,
      0x50,
      0x20,
      0x20,
      0x0d,
      0x0a,
      0x87,
      0x0a,
    ],
    mime: 'image/jpeg',
  },
  png: {
    sig: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    mime: 'image/png',
  },
  gif: {
    sig: [0x47, 0x49, 0x46, 0x38], // 'GIF87a' or 'GIF89a'
    mime: 'image/gif',
  },
  bmp: {
    sig: [0x42, 0x4d],
    mime: 'image/bmp',
  },

  // compressed
  zip: {
    sig: [0x50, 0x4b, 0x3, 0x4],
    mime: 'application/zip',
  },
};

/**
 * Compare file extension, file mime type and signature
 * @param {Object} file - value from FileReader.onload event.target.files
 * @param {Number[]} result - Array from Uint8Array of the loaded file
 * @returns {Boolean}
 */
export default function checkTypeAndExtensionMatches({ file, result }) {
  // file.name and file.type may be undefined in some browsers, see
  // https://developer.mozilla.org/en-US/docs/Web/API/File#browser_compatibility
  const extension = (file.name || '')
    .toLowerCase()
    .split('.')
    .pop();
  const match = extension && fileTypeSignatures[extension];
  const signature = match?.sig;

  if (match?.mime === file.type) {
    if (extension === 'txt') {
      return true;
    }
    if (signature) {
      return arrayIncludesArray(
        result,
        Array.isArray(signature)
          ? signature
          : [...signature].map(str => str.charCodeAt(0)),
      );
    }
  }
  return false;
}
