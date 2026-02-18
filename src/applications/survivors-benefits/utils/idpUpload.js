// Utility for sending uploaded PDFs to the IDP intake endpoint.
// Stubbed for now: returns a mock contract with stable shape.
//
// Exports a single function that returns a promise resolving with
// the document contract or throwing an error.

const isPdfFile = file =>
  file?.type === 'application/pdf' ||
  file?.name?.toLowerCase().endsWith('.pdf');

const makeStubId = () => {
  const now = Date.now().toString(36);
  const rand = Math.random()
    .toString(36)
    .slice(2, 8);
  return `stub-${now}-${rand}`;
};

export const uploadPdfToIdp = async file => {
  if (!isPdfFile(file)) {
    throw new Error('Unsupported file type for IDP upload.');
  }

  const id = makeStubId();
  return {
    id,
    bucket: 'stub-idp-bucket',
    // eslint-disable-next-line camelcase
    pdf_key: `${id}/${file?.name || 'document.pdf'}`,
  };
};

export default uploadPdfToIdp;
