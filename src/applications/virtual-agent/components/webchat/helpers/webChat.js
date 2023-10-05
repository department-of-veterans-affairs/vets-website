import recordEvent from 'platform/monitoring/record-event';

export const cardActionMiddleware = (
  decisionLetterEnabled,
  urls,
) => () => next => card => {
  const { cardAction } = card;
  // const isDecisionLetter = cardAction.value.includes('/v0/claim_letters/');
  const isDecisionLetter = () => {
    const url = cardAction.value.replace('https://', '');
    return urls.has(url);
  };
  const actionIsOpenUrl = cardAction.type === 'openUrl';
  if (decisionLetterEnabled && actionIsOpenUrl && isDecisionLetter()) {
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

export const activityMiddleware = (
  featureFlag,
  setOfUrls,
) => () => next => card => children => {
  const { activity } = card;
  const isDecisionLetterCard = () =>
    activity.type === 'message' &&
    activity.attachments[0]?.content?.body[0]?.text ===
      'Claims Decision Letters';
  if (featureFlag && isDecisionLetterCard()) {
    activity.attachments[0].content.body.forEach(body => {
      const isOpenUrl = () =>
        body?.columns?.[0]?.items?.[0]?.actions?.[0]?.type === 'Action.OpenUrl';
      if (isOpenUrl()) {
        const { url } = body.columns[0].items[0].actions[0];
        setOfUrls.add(url);
      }
    });
  }

  return next(card)(children);
};
