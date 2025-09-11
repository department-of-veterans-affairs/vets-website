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

    const conversationId = getConversationIdKey();
    const tokenKey = getTokenKey();
    if (!conversationId || !tokenKey) {
      setConversationIdKey(response.conversationId);
      setTokenKey(response.token);
      setToken(response.token);
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
    clearBotSessionStorage();
    getToken(setToken, setCode, setLoadingStatus);
  }, []);

  return { token, code, loadingStatus };
}
