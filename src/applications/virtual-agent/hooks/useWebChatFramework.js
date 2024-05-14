import { useState } from 'react';
import * as Sentry from '@sentry/browser';
import { COMPLETE, ERROR, LOADING } from '../utils/loadingStatus';
import useLoadWebChat from './useLoadWebChat';

const TIMEOUT_DURATION_MS = 250;

function checkForWebchat(setLoadingStatus, MAX_INTERVAL_CALL_COUNT, timeout) {
  let intervalCallCount = 0;
  const intervalId = setInterval(() => {
    intervalCallCount += 1;
    if (window.WebChat) {
      setLoadingStatus(COMPLETE);
      clearInterval(intervalId);
    } else if (intervalCallCount > MAX_INTERVAL_CALL_COUNT) {
      Sentry.captureException(new Error('Failed to load webchat framework'));
      setLoadingStatus(ERROR);
      clearInterval(intervalId);
    }
  }, timeout);
}

export default function useWebChatFramework(props) {
  const [loadingStatus, setLoadingStatus] = useState(
    window.WebChat ? COMPLETE : LOADING,
  );

  useLoadWebChat();

  const MAX_INTERVAL_CALL_COUNT = props.timeout / TIMEOUT_DURATION_MS;

  if (loadingStatus === LOADING) {
    checkForWebchat(
      setLoadingStatus,
      MAX_INTERVAL_CALL_COUNT,
      TIMEOUT_DURATION_MS,
    );
  }

  return { loadingStatus, webChatFramework: window.WebChat };
}
