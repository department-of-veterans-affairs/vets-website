import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';

export const cardActionMiddleware = decisionLetterEnabled => () => next => card => {
  const { cardAction } = card;
  const isDecisionLetter = cardAction.value.includes('/v0/claim_letters/');
  const actionIsOpenUrl = cardAction.type === 'openUrl';
  if (decisionLetterEnabled && actionIsOpenUrl && isDecisionLetter) {
    const recordDecisionLetterDownload = () =>
      recordEvent({
        event: 'file_download',
        'button-click-label': 'Decision Letter',
        time: new Date(Date.now()),
      });
    recordDecisionLetterDownload();
  }
  next(card);
};

export const ifMissingParamsCallSentry = (
  csrfToken,
  apiSession,
  userFirstName,
  userUuid,
) => {
  const missingParams = !(
    csrfToken &&
    apiSession &&
    typeof userFirstName === 'string' &&
    (userUuid === null || typeof userUuid === 'string')
  );
  if (missingParams) {
    const params = {
      csrfToken,
      apiSession,
      userFirstName,
      userUuid,
    };
    Sentry.captureException(
      new TypeError(`Missing required variables: ${JSON.stringify(params)}`),
    );
  }
};
