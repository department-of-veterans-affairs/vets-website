import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

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
    return <Shell />;
  }

  // for the legacy chatbot, decide which bot to show based on the floating bot toggle
  return virtualAgentShowFloatingChatbot ? <FloatingBot /> : <StickyBot />;
}

Page.propTypes = {
  virtualAgentShowChatbot: PropTypes.bool,
  virtualAgentShowFloatingChatbot: PropTypes.bool,
};

const mapStateToProps = state => ({
  virtualAgentShowFloatingChatbot: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot
  ],
  virtualAgentShowChatbot: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentShowChatbot
  ],
});

export default connect(mapStateToProps)(Page);
