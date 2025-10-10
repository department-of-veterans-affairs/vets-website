import { useEffect, useMemo } from 'react';
import {
  getConversationIdKey,
  getFirstConnection,
  getTokenKey,
  setFirstConnection,
} from '../utils/sessionStorage';

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
  const firstConnection = getFirstConnection();
  const domain = getDirectLineDomain();
  const isLocal = !!process.env.USE_LOCAL_DIRECTLINE;

  const conversationId = isLocal ? getConversationIdKey() : '';

  // Mark that we've connected once for subsequent reloads
  useEffect(() => {
    setFirstConnection('false');
  }, []);

  // Intentionally keep an empty dependency array to avoid recreating the DirectLine
  // connection on re-renders. We capture the initial token/domain/conversationId at
  // mount time to drive the desired reconnect behavior.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    const options = { token, domain };
    if (isLocal && conversationId) {
      options.conversationId = conversationId;
      if (firstConnection === 'false') {
        options.watermark = '0'; // local replay only after first mount
      }
    }
    return createDirectLine(options);
  }, []);
}
