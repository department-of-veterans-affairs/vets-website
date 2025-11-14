// Utility for sending uploaded PDFs to the IDP intake endpoint.
// Exports a single function that returns a promise resolving with
// the document id (string) or throwing an error.

import { apiRequest } from 'platform/utilities/api';
import { buildIntakeUrl } from './idpEndpoints';

const INTAKE_ENDPOINT = buildIntakeUrl();

const isPdfFile = file =>
  file?.type === 'application/pdf' ||
  file?.name?.toLowerCase().endsWith('.pdf');

const readFileAsBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { result } = reader;
        // result is in form data:<mime>;base64,<payload>
        const [, payload] = String(result).split(',');
        if (!payload) {
          reject(new Error('Unable to read file contents.'));
          return;
        }
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error('File read failed.'));
    };
    reader.readAsDataURL(file);
  });

export const uploadPdfToIdp = async file => {
  if (!isPdfFile(file)) {
    throw new Error('Unsupported file type for IDP upload.');
  }

  const pdfBase64 = await readFileAsBase64(file);

  /* eslint-disable camelcase */
  const requestPayload = {
    pdf_b64: pdfBase64,
    file_name: file.name,
  };
  /* eslint-enable camelcase */

  let payload;
  try {
    payload = await apiRequest(INTAKE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Filename': file.name,
      },
      body: JSON.stringify(requestPayload),
    });
  } catch (error) {
    const status = error?.status || 'unknown';
    const message =
      error?.error || error?.message || 'IDP intake request failed.';
    throw new Error(`IDP intake failed (${status}): ${message}`);
  }

  const { id, bucket } = payload || {};
  /* eslint-disable camelcase */
  const pdfKey = payload?.pdf_key;
  /* eslint-enable camelcase */

  if (!id) {
    throw new Error('IDP intake succeeded but no document id was returned.');
  }

  return {
    id,
    bucket,
    pdfKey,
  };
};

export default uploadPdfToIdp;
