import { useEffect } from 'react';

const END_CONVERSATION = 'endOfConversation';

export default function UnloadEventListener({ useSendEvent }) {
  const sendEvent = useSendEvent();

  useEffect(() =>
    window.addEventListener('beforeunload', () => {
      sendEvent(END_CONVERSATION);
    }),
  );

  return false;
}
