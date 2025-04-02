const createSaveInProgressUpdate = req => {
  const now = new Date().toISOString();

  const formId = req.params.id;

  const returnUrl =
    req.body.metadata.returnUrl || '/veteran-information?noReturnUrlSpecified';

  return {
    data: {
      id: '',
      type: 'in_progress_forms',
      attributes: {
        formId,
        createdAt: '2024-08-14T22:19:19.035Z',
        updatedAt: now,
        metadata: {
          version: 0,
          returnUrl,
          savedAt: Date.now(),
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          createdAt: Math.floor(Date.now() / 1000),
          expiresAt: Math.floor(Date.now() / 1000) + 5184000, // Current time + 60 days in seconds
          lastUpdated: Math.floor(Date.now() / 1000),
          inProgressFormId: 34920,
        },
      },
    },
  };
};

module.exports = { createSaveInProgressUpdate };
