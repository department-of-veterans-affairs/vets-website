import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { useEffect, useState } from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import { logErrorToDatadog } from '../utils/logging';
import retryOnce from '../utils/retryOnce';
import {
  clearBotSessionStorage,
  getConversationIdKey,
  getTokenKey,
  setConversationIdKey,
  setTokenKey,
  getCodeKey,
  setCodeKey,
} from '../utils/sessionStorage';

async function getToken(setToken, setCode, setLoadingStatus, forceNew = false) {
  try {
    const response = await retryOnce(() => {
      return apiRequest('/chatbot/token', {
        method: 'POST',
      });
    });

    // Overwrite when forced (non-persist mode) otherwise reuse if present
    const existingConversationId = getConversationIdKey();
    const existingToken = getTokenKey();
    if (forceNew || !existingConversationId || !existingToken) {
      setConversationIdKey(response.conversationId);
      setTokenKey(response.token);
      setToken(response.token);
    } else {
      setToken(existingToken);
    }
    setCode(response.code);
    setCodeKey(response.code);
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
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isSessionPersistenceEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled,
  );

  useEffect(
    () => {
      // Runs on mount and whenever isSessionPersistenceEnabled changes: prevents duplicate fetches on re-renders
      clearBotSessionStorage();

      // When persistence is OFF, force fresh token/conversationId.
      if (!isSessionPersistenceEnabled) {
        getToken(setToken, setCode, setLoadingStatus, true);
        return;
      }

      // When persistence is ON, reuse if present; else fetch new
      const existingConversationId = getConversationIdKey();
      const existingToken = getTokenKey();
      if (existingConversationId && existingToken) {
        const existingCode = getCodeKey();
        if (existingCode) {
          setToken(existingToken);
          setCode(existingCode);
          setLoadingStatus(COMPLETE);
          return;
        }
        // If code is missing, fetch to obtain a new code while preserving existing conversation
        getToken(setToken, setCode, setLoadingStatus);
        return;
      }

      getToken(setToken, setCode, setLoadingStatus);
    },
    [isSessionPersistenceEnabled],
  );

  return { token, code, loadingStatus };
}
