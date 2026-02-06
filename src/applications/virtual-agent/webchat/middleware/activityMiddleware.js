import { stripMarkdown } from '../utils/markdownRenderer';
import { AI_DISCLAIMER_TEXT } from '../utils/aiDisclaimerConstants';

export const activityMiddleware = () => next => card => {
  if (card.activity.type === 'trace') {
    return false;
  }

  const { activity } = card || {};
  const isRagAgentResponse =
    activity?.type === 'message' &&
    activity?.channelData?.category === 'rag-agent-response';

  // if the activity is an AI response, add the disclaimer text to the activity
  // the activity text is the AI response and may have markdown formatting so we need
  // to strip it before adding the disclaimer text
  if (isRagAgentResponse) {
    let existingFallbackText =
      activity?.channelData?.['webchat:fallback-text'] || activity?.text || '';

    if (existingFallbackText && /[[\]()*#`_-]/.test(existingFallbackText)) {
      existingFallbackText = stripMarkdown(existingFallbackText);
    }

    const disclaimerText = existingFallbackText
      ? ` ${AI_DISCLAIMER_TEXT}`
      : AI_DISCLAIMER_TEXT;

    const fallbackTextWithDisclaimer = `${existingFallbackText}${disclaimerText}`;

    activity.channelData['webchat:fallback-text'] = fallbackTextWithDisclaimer;
  }

  return next(card);
};
