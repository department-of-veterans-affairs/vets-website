import * as Sentry from '@sentry/browser';
import { ERROR } from './loadingStatus';

function hasAllParams(csrfToken, apiSession, userFirstName, userUuid) {
  return (
    csrfToken &&
    apiSession &&
    typeof userFirstName === 'string' &&
    (userUuid === null || typeof userUuid === 'string')
  );
}

function getSanitizedVariable(variable, variableName) {
  if (typeof variable === 'string' && variable) {
    return `${variableName} present`;
  }
  return variable;
}

export default function validateParameters({
  csrfToken,
  apiSession,
  userFirstName,
  userUuid,
  setParamLoadingStatusFn,
}) {
  if (hasAllParams(csrfToken, apiSession, userFirstName, userUuid)) {
    return;
  }

  setParamLoadingStatusFn(ERROR);

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
