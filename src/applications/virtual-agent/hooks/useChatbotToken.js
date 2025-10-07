import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { useEffect, useState } from 'react';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import { logErrorToDatadog } from '../utils/logging';
import retryOnce from '../utils/retryOnce';
import {
  clearBotSessionStorage,
  getConversationIdKey,
  getTokenKey,
  setConversationIdKey,
  setTokenKey,
} from '../utils/sessionStorage';

async function getToken(setToken, setCode, setLoadingStatus) {
  try {
    const response = await retryOnce(() => {
      return apiRequest('/chatbot/token', {
        method: 'POST',
      });
    });

    // Only store new values if not already present (reuse across reloads)
    const conversationId = getConversationIdKey();
    const tokenKey = getTokenKey();
    if (!conversationId || !tokenKey) {
      setConversationIdKey(response.conversationId);
      setTokenKey(response.token);
      setToken(response.token);
    } else {
      // We already had a token; prefer the existing one for continuity
      setToken(tokenKey);
    }
    setCode(response.code);
    setLoadingStatus(COMPLETE);
  } catch (ex) {
    const error = new Error('Could not retrieve chatbot token');
    logErrorToDatadog(true, error.message, error);
    setLoadingStatus(ERROR);
  }
}

export default function useChatbotToken() {
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(LOADING);

  useEffect(() => {
    // Intentionally run once on mount: prevents duplicate fetches on re-renders
    clearBotSessionStorage();

    // Reuse existing token/conversationId if present
    const existingConversationId = getConversationIdKey();
    const existingToken = getTokenKey();
    if (existingConversationId && existingToken) {
      setToken(existingToken);
      setLoadingStatus(COMPLETE);
      return;
    }

    // Otherwise, fetch and store new values
    getToken(setToken, setCode, setLoadingStatus);
  }, []);

  return { token, code, loadingStatus };
}
