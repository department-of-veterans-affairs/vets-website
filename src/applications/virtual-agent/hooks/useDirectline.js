import { useMemo } from 'react';
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

// First-connection logic:
// - Do NOT send conversationId on the very first connection in production
//   (breaks the bot's greeting/init flow).
// - Always send conversationId on subsequent connections to enable history replay.
// - In local mock mode, always include conversationId so the mock can persist state.
export default function useDirectLine(createDirectLine) {
  const token = getTokenKey();
  const firstConnection = getFirstConnection();
  const domain = getDirectLineDomain();

  const conversationId =
    firstConnection === 'false' || process.env.USE_LOCAL_DIRECTLINE
      ? getConversationIdKey()
      : '';

  // Mark that we've connected once for subsequent reloads
  setFirstConnection('false');

  // Intentionally keep an empty dependency array to avoid recreating the DirectLine
  // connection on re-renders. We capture the initial token/domain/conversationId at
  // mount time to drive the desired reconnect behavior.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () =>
      createDirectLine({
        token,
        domain,
        conversationId,
        watermark: '0', // request full transcript history
      }),
    [],
  );
}
