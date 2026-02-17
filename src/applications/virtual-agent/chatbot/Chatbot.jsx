// The following eslint rules are disabled in this file to allow for the Genesys script to be added to the page without issue.
// These rules are not ideal to disable, but they are necessary for this implementation and do not cause any known issues in this file.
/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
import React from 'react';

import {
  TOGGLE_NAMES,
  useToggleLoadingValue,
  useToggleValue,
} from 'platform/utilities/feature-toggles/useFeatureToggle';

// legacy webchat components
import ChatbotUnavailable from '../webchat/components/ChatbotUnavailable';
import FloatingBot from '../webchat/components/FloatingBot';
import StickyBot from '../webchat/components/StickyBot';

// v2 chatbot
import { Shell } from './features/shell/Shell';

const GENESYS_DEPLOYMENT_ID = 'b691fb78-8f63-4bb9-b691-8a75c8ce1e2f';

function Page() {
  const togglesLoading = useToggleLoadingValue();

  const virtualAgentUseV2Chatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentUseV2Chatbot,
  );

  const virtualAgentShowFloatingChatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentShowFloatingChatbot,
  );

  const virtualAgentShowChatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentShowChatbot,
  );

  if (togglesLoading) {
    return <va-loading-indicator />;
  }

  // handles if the chatbot is being completely hidden and replaced with an unavailable message
  if (virtualAgentShowChatbot === false) {
    return <ChatbotUnavailable />;
  }

  if (virtualAgentUseV2Chatbot) {
    (function(g, e, n, es, ys) {
      g._genesysJs = e;
      g[e] =
        g[e] ||
        function() {
          (g[e].q = g[e].q || []).push(arguments);
        };
      g[e].t = 1 * new Date();
      g[e].c = es;
      ys = document.createElement('script');
      ys.async = 1;
      ys.src = n;
      ys.charset = 'utf-8';
      document.head.appendChild(ys);
    })(
      window,
      'Genesys',
      'https://apps.use2.us-gov-pure.cloud/genesys-bootstrap/genesys.min.js',
      {
        environment: 'fedramp-use2-core',
        deploymentId: GENESYS_DEPLOYMENT_ID,
      },
    );

    return <Shell />;
  }

  // for the legacy chatbot, decide which bot to show based on the floating bot toggle
  return virtualAgentShowFloatingChatbot ? <FloatingBot /> : <StickyBot />;
}

export default Page;
