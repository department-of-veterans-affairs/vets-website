import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import retryOnce from './retryOnce';
import { COMPLETE, ERROR, LOADING } from './loadingStatus';
import { CONVERSATION_ID_KEY, TOKEN_KEY, COUNTER_KEY } from './utils';

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

      async function callVirtualAgentTokenApi() {
        return apiRequest('/virtual_agent_token', {
          method: 'POST',
        });
      }

      // const CONVERSATION_ID_KEY = 'conversationId';
      // const TOKEN_KEY = 'token';
      // const COUNTER_KEY = 'counter';

      async function getToken() {
        try {
          const response = await retryOnce(callVirtualAgentTokenApi);

          console.log('=== before if');
          if (!sessionStorage.getItem(CONVERSATION_ID_KEY)) {

            console.log('=== setting conversationId to ', response.conversationId);
            sessionStorage.setItem(
              CONVERSATION_ID_KEY,
              response.conversationId,
            );
            console.log('=== value in session is ', sessionStorage.getItem(CONVERSATION_ID_KEY));
            console.log('=== value of token is ', response.token);

            sessionStorage.setItem(TOKEN_KEY, response.token);
            sessionStorage.setItem(COUNTER_KEY, 0);
            console.log('=== value in session is ', sessionStorage.getItem(TOKEN_KEY));
          }

          // console.log(sessionStorage.getItem(CONVERSATION_ID_KEY));
          // console.log(sessionStorage.getItem(TOKEN_KEY));

          const counter = sessionStorage.getItem(COUNTER_KEY);
          sessionStorage.setItem('counter', parseInt(counter, 10) + 1);
          // console.log('counter is: ', localStorage.getItem('counter'));

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
