import { useState, useEffect } from 'react';
import { apiRequest } from 'platform/utilities/api';
import retryOnce from './retryOnce';
import { useSelector } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { COMPLETE, ERROR, LOADING } from './loadingStatus';

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

      async function getToken() {
        try {
          const response = await retryOnce(callVirtualAgentTokenApi);

          if (!localStorage.getItem('conversationId')) {
            localStorage.setItem('conversationId', response.conversationId);
            localStorage.setItem('token', response.token);
            localStorage.setItem('counter', 0);
          }

          console.log('hello');
          console.log(localStorage.getItem('conversationId'));
          console.log(localStorage.getItem('token'));

          const counter = localStorage.getItem('counter');
          localStorage.setItem('counter', parseInt(counter) + 1);
          console.log('counter is: ', localStorage.getItem('counter'));


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
