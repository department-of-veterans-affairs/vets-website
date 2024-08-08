import { useEffect } from 'react';

function setSendBoxMessage(microphoneEnabled) {
  const message =
    microphoneEnabled === 'true'
      ? 'Type or enable the microphone to speak'
      : 'Type your message';

  const sendBox = document.querySelector(
    'input[class="webchat__send-box-text-box__input"]',
  );

  ['aria-label', 'placeholder'].forEach(attr =>
    sendBox?.setAttribute(attr, message),
  );
}

export default function useSetSendBoxMessage(isRXSkill) {
  useEffect(() => setSendBoxMessage(isRXSkill), [isRXSkill]);
}
