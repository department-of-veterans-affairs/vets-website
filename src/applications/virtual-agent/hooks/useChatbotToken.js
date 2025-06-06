import { useState, useEffect } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import * as Sentry from '@sentry/browser';
import retryOnce from '../utils/retryOnce';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import {
  clearBotSessionStorage,
  setConversationIdKey,
  setTokenKey,
} from '../utils/sessionStorage';
import { logErrorToDatadog } from '../utils/logging';
import { useDatadogLogging } from './useDatadogLogging';

async function getToken(
  setToken,
  setCode,
  setLoadingStatus,
  isDatadogLoggingEnabled,
) {
  try {
    logErrorToDatadog(
      isDatadogLoggingEnabled,
      'vets-website - useChatbotToken',
      new Error('test'),
    );
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
    Sentry.captureException(error);
    logErrorToDatadog(isDatadogLoggingEnabled, error.message, error);
    setLoadingStatus(ERROR);
  }
}

export default function useChatbotToken(props) {
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [loadingStatus, setLoadingStatus] = useState(LOADING);
  const isDatadogLoggingEnabled = useDatadogLogging();

  useEffect(
    () => {
      clearBotSessionStorage();
      getToken(setToken, setCode, setLoadingStatus, isDatadogLoggingEnabled);
    },
    [props, isDatadogLoggingEnabled],
  );

  return { token, code, loadingStatus };
}
