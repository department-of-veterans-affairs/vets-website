import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { useEffect, useRef, useState } from 'react';
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
  getTokenExpiresAt,
  setTokenExpiresAt,
} from '../utils/sessionStorage';
import {
  parseTTLSeconds,
  getAlertTargetTs,
  shouldShowExpiryAlertAt,
} from '../utils/expiry';

// Helpers moved to utils/expiry.js

function clearSessionForNewConversation() {
  try {
    sessionStorage.removeItem('va-bot.token');
    sessionStorage.removeItem('va-bot.conversationId');
    sessionStorage.removeItem('va-bot.code');
    sessionStorage.removeItem('va-bot.tokenExpiresAt');
    sessionStorage.removeItem('va-bot.recentUtterances');
    sessionStorage.removeItem('va-bot.isTrackingUtterances');
    sessionStorage.removeItem('va-bot.skillEventValue');
    sessionStorage.removeItem('va-bot.conversationToken');
  } catch (e) {
    // no-op
  }
}

async function getToken(
  setToken,
  setCode,
  setLoadingStatus,
  forceNew = false,
  setExpiresAtCb = null,
  resetExpiredCb = null,
) {
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
    if (response.code) {
      setCode(response.code);
      setCodeKey(response.code);
    }
    const ttl = parseTTLSeconds(
      response && (response.expires_in ?? response.expiresIn),
    );
    const expiresAt = Date.now() + ttl * 1000;
    setTokenExpiresAt(expiresAt);
    if (typeof setExpiresAtCb === 'function') setExpiresAtCb(expiresAt);
    setLoadingStatus(COMPLETE);
    if (typeof resetExpiredCb === 'function') resetExpiredCb(false);
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
  const [expired, setExpired] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const expiryTimerRef = useRef(null);
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
        getToken(
          setToken,
          setCode,
          setLoadingStatus,
          true,
          setExpiresAt,
          setExpired,
        );
        return;
      }

      // When persistence is ON, reuse if present; else fetch new
      const existingConversationId = getConversationIdKey();
      const existingToken = getTokenKey();
      if (existingConversationId && existingToken) {
        // 1) Check expiry first (expire only if we have a stored timestamp)
        const storedExpiresAt = getTokenExpiresAt();
        if (shouldShowExpiryAlertAt(storedExpiresAt)) {
          setExpired(true);
          // Preserve current token & transcript; do not auto-refresh
          setToken(existingToken);
          setLoadingStatus(COMPLETE);
          return;
        }

        // If expiry missing, request it; also fetch code if missing. This does NOT force a new token/conversation.
        const existingCode = getCodeKey();
        const needsMeta = !storedExpiresAt || !existingCode;
        if (needsMeta) {
          getToken(
            setToken,
            setCode,
            setLoadingStatus,
            true,
            setExpiresAt,
            setExpired,
          );
        } else {
          // Schedule with known expiry
          setExpiresAt(storedExpiresAt);
          setCode(existingCode);
        }

        // Not expired; ensure alert is hidden
        setExpired(false);
        setToken(existingToken);
        setLoadingStatus(COMPLETE);
        return;
      }

      getToken(
        setToken,
        setCode,
        setLoadingStatus,
        false,
        setExpiresAt,
        setExpired,
      );
    },
    [isSessionPersistenceEnabled],
  );

  // Fallback: if socket hits an unrecoverable error (e.g., 403), trigger refresh
  useEffect(
    () => {
      function onConnErr() {
        if (!isSessionPersistenceEnabled) return;
        // Connection error often means expired token. Freeze UI and wait for user reset.
        setExpired(true);
      }
      window.addEventListener('va-chatbot-connection-error', onConnErr);
      return () =>
        window.removeEventListener('va-chatbot-connection-error', onConnErr);
    },
    [isSessionPersistenceEnabled],
  );

  // Schedule or trigger expiry based on expiresAt
  useEffect(
    () => {
      if (!isSessionPersistenceEnabled) return undefined;
      const target = getAlertTargetTs(expiresAt || getTokenExpiresAt());
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      if (!target) return undefined;

      const now = Date.now();
      if (now >= target) {
        // Expired: show alert and freeze until user resets
        setExpired(true);
        return undefined;
      }

      const delay = Math.max(0, target - now);
      expiryTimerRef.current = setTimeout(() => {
        if (!isSessionPersistenceEnabled) return;
        // Expired: show alert and freeze until user resets
        setExpired(true);
      }, delay);

      return () => {
        if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      };
    },
    [expiresAt, isSessionPersistenceEnabled],
  );

  // Ensure expiry handling triggers when tab regains focus or becomes visible (timers can be throttled)
  useEffect(
    () => {
      if (!isSessionPersistenceEnabled) return undefined;
      const checkExpiry = () => {
        const target = getAlertTargetTs(getTokenExpiresAt());
        if (target && Date.now() >= target) {
          // Expired while tab hidden; set expired but do not auto-refresh
          setExpired(true);
        }
      };
      const onFocus = checkExpiry;
      const onVisibilityChange = () => {
        if (document.visibilityState === 'visible') checkExpiry();
      };
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibilityChange);
      return () => {
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      };
    },
    [isSessionPersistenceEnabled],
  );

  // Allow parent UI to request a full reset on alert close
  useEffect(() => {
    function onReset() {
      clearSessionForNewConversation();
      getToken(
        setToken,
        setCode,
        setLoadingStatus,
        true,
        setExpiresAt,
        setExpired,
      );
    }
    window.addEventListener('va-chatbot-reset', onReset);
    return () => window.removeEventListener('va-chatbot-reset', onReset);
  }, []);

  return { token, code, loadingStatus, expired };
}
