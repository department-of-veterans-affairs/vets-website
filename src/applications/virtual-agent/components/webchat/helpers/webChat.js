import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import { IS_RX_SKILL } from '../../chatbox/utils';

export const handleCardAction = (
  cardTargetClassList,
  cardActionValue,
  isRxSkill,
) => {
  for (const item of cardTargetClassList) {
    if (
      item === 'webchat__suggested-action' ||
      item === 'webchat__suggested-action__text'
    ) {
      if (isRxSkill === 'true') {
        recordEvent({
          event: 'chatbot-button-click',
          clickText: cardActionValue,
          topic: 'prescriptions',
        });
      } else {
        recordEvent({
          event: 'chatbot-button-click',
          clickText: cardActionValue,
          topic: undefined,
        });
      }
    }
  }
};

export const cardActionMiddleware = () => next => card => {
  const { cardAction } = card;
  if (!cardAction) return next(card);
  const cardActionValue = cardAction.value;
  const cardTargetClassList = card?.target?.classList;
  const isRxSkill = sessionStorage.getItem(IS_RX_SKILL);

  if (cardTargetClassList) {
    handleCardAction(cardTargetClassList, cardActionValue, isRxSkill);
  }
  const isDecisionLetter =
    typeof cardAction.value === 'string' &&
    cardAction.value.includes('/v0/claim_letters/');
  const actionIsOpenUrl = cardAction.type === 'openUrl';
  if (actionIsOpenUrl && isDecisionLetter) {
    const recordDecisionLetterDownloadInGoogleAnalytics = () =>
      recordEvent({
        event: 'file_download',
        'button-click-label': 'Decision Letter',
        time: new Date(Date.now()),
      });
    recordDecisionLetterDownloadInGoogleAnalytics();
  }
  return next(card);
};

export const hasAllParams = (csrfToken, apiSession, userFirstName, userUuid) =>
  csrfToken &&
  apiSession &&
  typeof userFirstName === 'string' &&
  (userUuid === null || typeof userUuid === 'string');

export const ifMissingParamsCallSentry = (
  csrfToken,
  apiSession,
  userFirstName,
  userUuid,
) => {
  const doesNotHaveAllParams = !hasAllParams(
    csrfToken,
    apiSession,
    userFirstName,
    userUuid,
  );
  const getSanitizedVariable = (variable, variableName) => {
    if (variable === undefined) {
      return `${variableName} was undefined`;
    }
    if (typeof variable === 'string' && variable) {
      return `${variableName} present`;
    }
    return variable;
  };

  if (doesNotHaveAllParams) {
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
