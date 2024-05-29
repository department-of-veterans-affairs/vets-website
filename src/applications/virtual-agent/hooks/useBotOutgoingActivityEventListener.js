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

export default function useBotOutgoingActivityEventListener(chatBotLoadTime) {
  const [lastMessageTime, setLastMessageTime] = useState(0);

  useEffect(() => {
    window.addEventListener('bot-outgoing-activity', () =>
      reloadWindow(lastMessageTime, setLastMessageTime, chatBotLoadTime),
    );
  });
}
