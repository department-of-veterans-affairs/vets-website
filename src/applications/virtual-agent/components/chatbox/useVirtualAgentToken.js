import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import retryOnce from './retryOnce';
import { COMPLETE, ERROR, LOADING } from './loadingStatus';
import {
  clearBotSessionStorage,
  CONVERSATION_ID_KEY,
  TOKEN_KEY,
} from './utils';

function useWaitForCsrfToken(props) {
  // Once the feature toggles have loaded, the csrf token updates
  const csrfTokenLoading = useSelector(state => state.featureToggles.loading);
  const [csrfTokenLoadingError, setCsrfTokenLoadingError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (csrfTokenLoading) {
        setCsrfTokenLoadingError(true);
        Sentry.captureException(
          new Error('Could not load feature toggles within timeout'),
        );
      }
    }, props.timeout);
    return function cleanup() {
      clearTimeout(timeout);
    };
  });

  return [csrfTokenLoading, csrfTokenLoadingError];
}

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

export default function useVirtualAgentToken(props) {
  const [token, setToken] = useState('');
  const [apiSession, setApiSession] = useState('');
  const [csrfTokenLoading, csrfTokenLoadingError] = useWaitForCsrfToken(props);
  const [loadingStatus, setLoadingStatus] = useState(LOADING);

  useEffect(
    () => {
      if (csrfTokenLoadingError) {
        setLoadingStatus(ERROR);
      }
      if (csrfTokenLoading) return;

      clearBotSessionStorage();

      async function getToken() {
        try {
          const apiCall = callVirtualAgentTokenApi(
            props.virtualAgentEnableMsftPvaTesting,
            props.virtualAgentEnableNluPvaTesting,
            apiRequest,
          );
          const response = await retryOnce(apiCall);

          sessionStorage.setItem(CONVERSATION_ID_KEY, response.conversationId);
          sessionStorage.setItem(TOKEN_KEY, response.token);

          setToken(response.token);
          setApiSession(response.apiSession);
          setLoadingStatus(COMPLETE);
        } catch (ex) {
          Sentry.captureException(
            new Error('Could not retrieve virtual agent token'),
          );
          setLoadingStatus(ERROR);
        }
      }
      getToken();
    },
    [csrfTokenLoading, csrfTokenLoadingError],
  );

  return { token, loadingStatus, apiSession };
}
