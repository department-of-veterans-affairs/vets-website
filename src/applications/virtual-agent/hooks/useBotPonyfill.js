import { useEffect } from 'react';

import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

async function createPonyFill(webchat, environment) {
  const region =
    environment.isDev() || environment.isLocalhost() ? 'eastus' : 'eastus2';

  const speechToken = await apiRequest('/virtual_agent_speech_token', {
    method: 'POST',
  });

  return webchat.createCognitiveServicesSpeechServicesPonyfillFactory({
    credentials: {
      region,
      authorizationToken: speechToken.token,
    },
  });
}

export default function useBotPonyFill(setBotPonyfill, environment) {
  useEffect(
    () =>
      createPonyFill(window.WebChat, environment).then(res =>
        setBotPonyfill(() => res),
      ),
    [],
  );
}
