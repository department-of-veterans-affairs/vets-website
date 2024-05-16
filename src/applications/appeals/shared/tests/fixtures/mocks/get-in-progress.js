import { add, getUnixTime } from 'date-fns';

export default function inProgressMock({
  data = {},
  returnUrl = '/review-and-submit',
  version = 2,
} = {}) {
  return {
    formData: data,
    metadata: {
      version,
      returnUrl,
      savedAt: 1715367037707,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      createdAt: 1715367010,
      expiresAt: getUnixTime(add(new Date(), { days: 30 })),
      lastUpdated: 1715367037,
      inProgressFormId: 460,
    },
  };
}
