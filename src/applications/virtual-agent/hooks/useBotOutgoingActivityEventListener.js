import { useState, useEffect } from 'react';

const ONE_SEC_IN_MILLISECONDS = 1000;
const ONE_MIN = ONE_SEC_IN_MILLISECONDS * 60;

function reloadWindow(lastMessageTime, setLastMessageTime, chatBotLoadTime) {
  const currentTime = Date.now();

  if (lastMessageTime && currentTime - lastMessageTime > 30 * ONE_MIN) {
    window.location.reload();
  } else {
    setLastMessageTime(currentTime);
    if (currentTime - chatBotLoadTime > 60 * ONE_MIN) {
      window.location.reload();
    }
  }
}

export default function useBotOutgoingActivityEventListener(
  chatBotLoadTime,
  enabled = true,
) {
  const [lastMessageTime, setLastMessageTime] = useState(0);

  useEffect(
    () => {
      // Skip listener registration when disabled (e.g., session persistence is on)
      if (!enabled) return undefined;

      const handler = () =>
        reloadWindow(lastMessageTime, setLastMessageTime, chatBotLoadTime);
      window.addEventListener('bot-outgoing-activity', handler);
      return () => window.removeEventListener('bot-outgoing-activity', handler);
    },
    [enabled, lastMessageTime, chatBotLoadTime],
  );
}
