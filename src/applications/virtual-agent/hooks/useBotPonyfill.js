import { useEffect } from 'react';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

async function fetchCredentials() {
  const region =
    environment.isDev() || environment.isLocalhost() ? 'eastus' : 'eastus2';

  const speechToken = await apiRequest('/virtual_agent_speech_token', {
    method: 'POST',
  });

  return {
    region,
    authorizationToken: speechToken.token,
  };
  // return webchat.createCognitiveServicesSpeechServicesPonyfillFactory({
  //   credentials: {
  //     region,
  //     authorizationToken: speechToken.token,
  //   },
  // });
}

export default function useBotPonyFill(setBotPonyfill) {
  useEffect(
    () =>
      window.WebChat.createDirectLineSpeechAdapters({
        fetchCredentials,
      }).then(res => setBotPonyfill(() => res)),
    // createPonyFill(window.WebChat, environment).then(res =>
    //   setBotPonyfill(() => res),
    // ),
    [],
  );
}
