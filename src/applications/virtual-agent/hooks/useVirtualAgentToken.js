import { useState, useEffect } from 'react';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import * as Sentry from '@sentry/browser';
import retryOnce from '../utils/retryOnce';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import { useWaitForCsrfToken } from './useWaitForCsrfToken';
import {
  clearBotSessionStorage,
  setConversationIdKey,
  setTokenKey,
} from '../utils/sessionStorage';
import { logErrorToDatadog } from '../utils/logging';
import { useDatadogLogging } from './useDatadogLogging';

export function callVirtualAgentTokenApi(
  virtualAgentEnableMsftPvaTesting,
  virtualAgentEnableNluPvaTesting,
  apiRequestFn,
) {
  return async () => {
    if (virtualAgentEnableMsftPvaTesting) {
      return apiRequestFn('/virtual_agent_token_msft', {
        method: 'POST',
      });
    }
    if (virtualAgentEnableNluPvaTesting) {
      return apiRequestFn('/virtual_agent_token_nlu', { method: 'POST' });
    }
    return apiRequestFn('/virtual_agent_token', {
      method: 'POST',
    });
  };
}

async function getToken(
  props,
  setToken,
  setApiSession,
  setLoadingStatus,
  isDatadogLoggingEnabled,
) {
  try {
    logErrorToDatadog(
      isDatadogLoggingEnabled,
      'vets-website - useVirtualAgentToken',
      new Error('test'),
    );
    const apiCall = callVirtualAgentTokenApi(
      props.virtualAgentEnableMsftPvaTesting,
      props.virtualAgentEnableNluPvaTesting,
      apiRequest,
    );
    const response = await retryOnce(apiCall);

    setConversationIdKey(response.conversationId);
    setTokenKey(response.token);
    setToken(response.token);
    setApiSession(response.apiSession);
    setLoadingStatus(COMPLETE);
  } catch (ex) {
    const error = new Error('Could not retrieve virtual agent token');
    Sentry.captureException(error);
    logErrorToDatadog(isDatadogLoggingEnabled, error.message, error);
    setLoadingStatus(ERROR);
  }
}

export default function useVirtualAgentToken(props) {
  const [token, setToken] = useState('');
  const [apiSession, setApiSession] = useState('');
  const [csrfTokenLoading, csrfTokenLoadingError] = useWaitForCsrfToken(props);
  const [loadingStatus, setLoadingStatus] = useState(LOADING);
  const isDatadogLoggingEnabled = useDatadogLogging();

  useEffect(
    () => {
      if (csrfTokenLoadingError) {
        setLoadingStatus(ERROR);
      }
      if (csrfTokenLoading) return;

      clearBotSessionStorage();

      getToken(
        props,
        setToken,
        setApiSession,
        setLoadingStatus,
        isDatadogLoggingEnabled,
      );
    },
    [csrfTokenLoading, csrfTokenLoadingError, props, isDatadogLoggingEnabled],
  );

  return { token, loadingStatus, apiSession };
}
