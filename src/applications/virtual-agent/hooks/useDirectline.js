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

export default function useDirectLine(createDirectLine) {
  const token = getTokenKey();
  const firstConnection = getFirstConnection();
  // The first time we connect, we can't send the conversationId
  // because it breaks the bot. On subsequent connections, we need
  // to send it. DirectLine mock needs it even on first connection
  // so that it can save it for subsequent connections.
  const conversationId =
    firstConnection === 'false' || process.env.USE_LOCAL_DIRECTLINE
      ? getConversationIdKey()
      : '';
  const domain = getDirectLineDomain();
  setFirstConnection('false');

  return useMemo(
    () =>
      createDirectLine({
        token,
        domain,
        conversationId,
        watermark: '0',
      }),
    [],
  );
}
