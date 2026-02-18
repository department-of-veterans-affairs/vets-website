const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_OPTIONS = {
  intervalMs: 2000,
  timeoutMs: 120000,
};

// Stubbed for now: immediately returns a "completed" payload with a stable shape.
export const pollDocumentStatus = async (documentId, options = {}) => {
  const { intervalMs } = { ...DEFAULT_OPTIONS, ...options };

  // Keep it async and mimic a brief poll delay.
  await sleep(Math.min(intervalMs, 25));

  return {
    id: documentId,
    // eslint-disable-next-line camelcase
    scan_status: 'completed',
    // eslint-disable-next-line camelcase
    updated_at: new Date().toISOString(),
  };
};

export default pollDocumentStatus;
