import recordEvent from 'platform/monitoring/record-event';

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
