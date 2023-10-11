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
  const hasAllParams =
    csrfToken &&
    apiSession &&
    typeof userFirstName === 'string' &&
    (userUuid === null || typeof userUuid === 'string');
  const getSanitizedVariable = (variable, variableName) => {
    if (variable === undefined) {
      return `${variableName} was undefined`;
    }
    if (typeof variable === 'string' && variable) {
      return `${variableName} present`;
    }
    return variable;
  };

  if (!hasAllParams) {
    const sanitizedCsrfToken = getSanitizedVariable(csrfToken, 'csrfToken');
    const sanitizedApiSession = getSanitizedVariable(apiSession, 'apiSession');
    const sanitizedUserFirstName = getSanitizedVariable(
      userFirstName,
      'userFirstName',
    );
    const sanitizedUserUuid = getSanitizedVariable(userUuid, 'userUuid');
    const params = {
      csrfToken: sanitizedCsrfToken,
      apiSession: sanitizedApiSession,
      userFirstName: sanitizedUserFirstName,
      userUuid: sanitizedUserUuid,
    };
    Sentry.captureException(
      new TypeError(
        `Virtual Agent chatbot bad start - missing required variables: ${JSON.stringify(
          params,
        )}`,
      ),
    );
  }
};
