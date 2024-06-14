/**
 * Syncing 526 online form with paper form
 *  Move housing-situation and terminally-ill pages from additionalInformation to veteranDetails chapter which
 *    is from the last chapter to the first. If user has progressed beyond the first couple pages and hasn't
 *    filled either of these out yet, redirect to them.
 *  Fully developed claim page was removed. If they left off here, redirect to review and submit page.
 */
export default function reorderHousingIllnessRemoveFdc(savedData) {
  const { returnUrl } = savedData.metadata;

  if (
    returnUrl === '/veteran-information' ||
    returnUrl === '/contact-information'
  ) {
    return savedData;
  }

  const { formData } = savedData;
  if (formData.homelessOrAtRisk === undefined) {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/housing-situation',
      },
    };
  }

  if (formData.isTerminallyIll === undefined) {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/terminally-ill',
      },
    };
  }

  if (returnUrl === '/fully-developed-claim') {
    return {
      ...savedData,
      metadata: {
        ...savedData.metadata,
        returnUrl: '/review-and-submit',
      },
    };
  }

  return savedData;
}
