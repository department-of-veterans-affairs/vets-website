import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import React, { useState } from 'react';

import useBotOutgoingActivityEventListener from '../hooks/useBotOutgoingActivityEventListener';
import useWebMessageActivityEventListener from '../hooks/useWebMessageActivityEventListener';
import Bot from './Bot';

export default function Chatbox() {
  const [chatBotLoadTime] = useState(Date.now());
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isSessionPersistenceEnabled = useToggleValue(
    TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled,
  );

  // Disable the 60-minute reload guard when session persistence is enabled,
  // as the new session reset flow handles token expiry gracefully
  useBotOutgoingActivityEventListener(
    chatBotLoadTime,
    !isSessionPersistenceEnabled,
  );
  useWebMessageActivityEventListener();

  return <Bot />;
}
