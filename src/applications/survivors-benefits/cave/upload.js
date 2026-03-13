import { apiRequest } from 'platform/utilities/api';
import { buildIntakeUrl } from './endpoints';

const isPdfFile = file =>
  file?.type === 'application/pdf' ||
  file?.name?.toLowerCase().endsWith('.pdf');

export const uploadDocument = async file => {
  if (!isPdfFile(file)) {
    throw new Error('Unsupported file type for CAVE upload.');
  }

  const formData = new FormData();
  formData.append('file', file, file.name);

  let payload;
  try {
    payload = await apiRequest(buildIntakeUrl(), {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    const status = error?.status || 'unknown';
    const message =
      error?.error || error?.message || 'CAVE intake request failed.';
    throw new Error(`CAVE intake failed (${status}): ${message}`);
  }

  const { id, bucket, pdfKey } = payload || {};

  if (!id) {
    throw new Error('CAVE intake succeeded but no document id was returned.');
  }

  return { id, bucket, pdfKey };
};

export default uploadDocument;
