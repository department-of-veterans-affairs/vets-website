import { useState, useEffect } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import retryOnce from '../utils/retryOnce';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import {
  clearBotSessionStorage,
  setConversationIdKey,
  setTokenKey,
} from '../utils/sessionStorage';
import logger from '../utils/logger';

async function getToken(setToken, setCode, setLoadingStatus) {
  try {
    const response = await retryOnce(() => {
      return apiRequest('/chatbot/token', {
        method: 'POST',
      });
    });

    setConversationIdKey(response.conversationId);
    setTokenKey(response.token);
    setToken(response.token);
    setCode(response.code);
    setLoadingStatus(COMPLETE);
  } catch (ex) {
    const error = new Error('Could not retrieve chatbot token');
    logger.error(error.message, error);
    setLoadingStatus(ERROR);
  }
}

export default function useChatbotToken(props) {
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(LOADING);

  useEffect(
    () => {
      clearBotSessionStorage();
      getToken(setToken, setCode, setLoadingStatus);
    },
    [props],
  );

  return { token, code, loadingStatus };
}
