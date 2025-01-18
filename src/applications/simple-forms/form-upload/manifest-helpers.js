const { v5 } = require('uuid');

const stringToUUID = input => {
  // Example namespace
  const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
  return v5(input, NAMESPACE);
};

export const buildManifest = formNumber => {
  return {
    appName: `${formNumber} Form Upload`,
    entryFile: './app-entry.jsx',
    entryName: `form-upload-flow-${formNumber}`,
    rootUrl: `/find-forms/about-va-form-${formNumber}/form-upload`,
    productId: stringToUUID(formNumber),
  };
};
