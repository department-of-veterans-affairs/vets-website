import { useMemo } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { getConversationIdKey, getTokenKey } from '../utils/sessionStorage';

const getDirectLineDomain = () =>
  process.env.USE_LOCAL_DIRECTLINE
    ? 'http://localhost:3002/v3/directline'
    : 'https://northamerica.directline.botframework.com/v3/directline';

// Connection logic:
// - Production DirectLine (websocket) does not replay history with watermark.
//   To guarantee greeting and avoid blank chat on reload, always start a NEW
//   conversation (omit conversationId/watermark) in production.
// - Local mock supports watermark-based replay: include conversationId and
//   watermark=0 to request full transcript.
export default function useDirectLine(createDirectLine) {
  const token = getTokenKey();
  const domain = getDirectLineDomain();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isSessionPersistenceEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled,
  );

  // Always capture the conversationId from the token endpoint so the socket
  // attaches to the correct conversation. Replay remains gated by watermark
  // below.
  const conversationId = getConversationIdKey();

  // Intentionally keep an empty dependency array to avoid recreating the DirectLine
  // connection on re-renders. We capture the initial token/domain/conversationId at
  // mount time to drive the desired reconnect behavior.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Intentionally keep a stable DirectLine instance across renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => {
      const options = { token, domain };
      if (conversationId) {
        options.conversationId = conversationId;
      }
      if (isSessionPersistenceEnabled) {
        options.watermark = '0';
      }
      return createDirectLine(options);
    },
    [token, domain, isSessionPersistenceEnabled, conversationId],
  );
}
