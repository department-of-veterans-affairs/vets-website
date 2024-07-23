import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { getIsRxSkill } from '../utils/sessionStorage';

const suggestedActionClasses = [
  'webchat__suggested-action',
  'webchat__suggested-action__text',
];

function recordSuggestedAction(
  cardTargetClassList,
  cardActionValue,
  isRxSkill,
) {
  if (!cardTargetClassList) {
    return;
  }

  const isSuggestedAction = Array.from(cardTargetClassList).some(item =>
    suggestedActionClasses.includes(item),
  );

  if (isSuggestedAction) {
    const topic = isRxSkill === 'true' ? 'prescriptions' : undefined;
    recordEvent({
      event: 'chatbot-button-click',
      clickText: cardActionValue,
      topic,
    });
  }
}

function recordDecisionLetterDownload(cardAction) {
  const isDecisionLetter =
    typeof cardAction.value === 'string' &&
    cardAction.value.includes('/v0/claim_letters/');

  const actionIsOpenUrl = cardAction.type === 'openUrl';

  if (actionIsOpenUrl && isDecisionLetter) {
    recordEvent({
      event: 'file_download',
      'button-click-label': 'Decision Letter',
      time: new Date(Date.now()),
    });
  }
}

export const cardActionMiddleware = () => next => card => {
  const { cardAction } = card;

  if (!cardAction) return next(card);

  const cardActionValue = cardAction.value;
  const cardTargetClassList = card?.target?.classList;
  const isRxSkill = getIsRxSkill();

  recordSuggestedAction(cardTargetClassList, cardActionValue, isRxSkill);
  recordDecisionLetterDownload(cardAction);

  return next(card);
};
