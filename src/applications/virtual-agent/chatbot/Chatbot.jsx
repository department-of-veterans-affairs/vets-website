// The following eslint rules are disabled in this file to allow for the Genesys script to be added to the page without issue.
// These rules are not ideal to disable, but they are necessary for this implementation and do not cause any known issues in this file.
/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';

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
import {
  GENESYS_CONFIG,
  getActiveDeploymentId,
  getDeploymentMode,
  setDeploymentMode,
} from './features/messaging/constants';
import MessagingInitializer from './features/messaging/MessagingInitializer';
import { Shell } from './features/shell/Shell';

function Page() {
  const togglesLoading = useToggleLoadingValue();
  const [deploymentMode, setDeploymentModeState] = useState(
    getDeploymentMode(),
  );

  const virtualAgentUseV2Chatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentUseV2Chatbot,
  );

  const virtualAgentShowFloatingChatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentShowFloatingChatbot,
  );

  const virtualAgentShowChatbot = useToggleValue(
    TOGGLE_NAMES.virtualAgentShowChatbot,
  );

  useEffect(() => {
    setDeploymentModeState(getDeploymentMode());
  }, []);

  const handleSwitchDeployment = () => {
    const newMode = deploymentMode === 'headless' ? 'widget' : 'headless';
    setDeploymentMode(newMode);
    window.location.reload();
  };

  if (togglesLoading) {
    return <va-loading-indicator />;
  }

  // handles if the chatbot is being completely hidden and replaced with an unavailable message
  if (virtualAgentShowChatbot === false) {
    return <ChatbotUnavailable />;
  }

  if (virtualAgentUseV2Chatbot) {
    const activeDeploymentId = getActiveDeploymentId();

    // eslint-disable-next-line func-names
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
        environment: GENESYS_CONFIG.region,
        deploymentId: activeDeploymentId,
      },
    );
    return (
      <>
        <MessagingInitializer>
          {({ startConversation, sendMessage, clearConversation }) => (
            <Shell
              clearConversation={clearConversation}
              startConversation={startConversation}
              sendMessage={sendMessage}
            />
          )}
        </MessagingInitializer>
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            borderTop: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
          }}
        >
          <va-button
            onClick={handleSwitchDeployment}
            text={`Switch to ${
              deploymentMode === 'headless' ? 'Widget' : 'Headless'
            } Mode`}
          />
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            Current: {deploymentMode === 'headless' ? 'Headless' : 'Widget'}{' '}
            Deployment
          </div>
        </div>
      </>
    );
  }

  // for the legacy chatbot, decide which bot to show based on the floating bot toggle
  return virtualAgentShowFloatingChatbot ? <FloatingBot /> : <StickyBot />;
}

export default Page;
