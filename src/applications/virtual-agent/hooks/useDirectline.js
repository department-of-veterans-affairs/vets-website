import { useMemo } from 'react';
import {
  getConversationIdKey,
  getLoggedInFlow,
  getTokenKey,
} from '../utils/sessionStorage';

const getIsLoggedIn = isLoggedIn => {
  const loggedInFlow = getLoggedInFlow();
  return loggedInFlow === 'true' && isLoggedIn;
};

function getConversationId(isLoggedIn) {
  const conversationIdKey = getConversationIdKey();
  return isLoggedIn ? conversationIdKey : '';
}

function getDirectLineToken(token, isLoggedIn) {
  const tokenKey = getTokenKey();
  return isLoggedIn ? tokenKey : token;
}

const getDirectLineDomain = () =>
  process.env.USE_LOCAL_DIRECTLINE
    ? 'http://localhost:3002/v3/directline'
    : 'https://northamerica.directline.botframework.com/v3/directline';

export default function useDirectLine(
  createDirectLine,
  directLineToken,
  loggedIn,
) {
  const isLoggedIn = getIsLoggedIn(loggedIn);
  const token = getDirectLineToken(directLineToken, isLoggedIn);
  const conversationId = getConversationId(isLoggedIn);
  const domain = getDirectLineDomain();

  return useMemo(
    () =>
      createDirectLine({
        token,
        domain,
        conversationId,
        watermark: '',
      }),
    [createDirectLine],
  );
}
