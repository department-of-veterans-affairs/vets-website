import { useEffect, useMemo, useState } from 'react';
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

  const initialOptions = useMemo(
    () => {
      const opts = { token, domain };
      if (isSessionPersistenceEnabled && conversationId) {
        opts.conversationId = conversationId;
      }
      if (isSessionPersistenceEnabled) {
        opts.watermark = '0';
      }
      return opts;
    },
    [token, domain, isSessionPersistenceEnabled, conversationId],
  );

  const initialInstance = useMemo(() => createDirectLine(initialOptions), [
    createDirectLine,
    initialOptions,
  ]);

  const [directLine, setDirectLine] = useState(initialInstance);

  useEffect(
    () => {
      let unsub;
      const instance = initialInstance;
      if (
        instance &&
        instance.connectionStatus$ &&
        instance.connectionStatus$.subscribe
      ) {
        let attemptedFallback = false;
        unsub = instance.connectionStatus$.subscribe(status => {
          if (status === 4 && !attemptedFallback) {
            attemptedFallback = true;
            const fallbackOptions = { token, domain };
            const freshInstance = createDirectLine(fallbackOptions);
            setDirectLine(freshInstance);
            if (unsub && typeof unsub.unsubscribe === 'function') {
              unsub.unsubscribe();
            }
          }
        });
      }
      return () => {
        if (unsub && typeof unsub.unsubscribe === 'function') {
          unsub.unsubscribe();
        }
      };
    },
    [initialInstance, createDirectLine, token, domain],
  );

  return directLine;
}
