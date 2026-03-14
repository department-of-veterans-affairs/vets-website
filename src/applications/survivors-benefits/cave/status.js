import { apiRequest } from 'platform/utilities/api';
import { buildStatusUrl } from './endpoints';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_OPTIONS = {
  intervalMs: 2000,
  timeoutMs: 360000,
};

export const pollDocumentStatus = async (documentId, options = {}) => {
  const { intervalMs, timeoutMs } = { ...DEFAULT_OPTIONS, ...options };
  const deadline = Date.now() + timeoutMs;

  let lastError;

  while (Date.now() <= deadline) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const payload = await apiRequest(buildStatusUrl(documentId));
      const { scanStatus } = payload || {};
      if (scanStatus === 'completed' || scanStatus === 'failed') {
        return payload;
      }
    } catch (error) {
      lastError = error;
    }

    // eslint-disable-next-line no-await-in-loop
    await sleep(intervalMs);
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('Timed out waiting for document processing to complete.');
};

export default pollDocumentStatus;
