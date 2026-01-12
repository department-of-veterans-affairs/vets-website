import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import FloatingBot from './FloatingBot';
import StickyBot from './StickyBot';
import ChatbotUnavailable from './ChatbotUnavailable';
import useChosenBot from '../hooks/useChosenBot';

export const renderPageContent = (isLoading, chosenBot, showChatbot) => {
  if (showChatbot === false) {
    return <ChatbotUnavailable />;
  }
  if (isLoading) {
    return <va-loading-indicator />;
  }
  if (chosenBot === 'sticky') {
    return <StickyBot />;
  }
  if (chosenBot === 'default') {
    return <FloatingBot />;
  }

  return '';
};

function Page({
  virtualAgentShowFloatingChatbot = null,
  virtualAgentShowChatbot = true,
}) {
  const [chosenBot, setChosenBot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useChosenBot(virtualAgentShowFloatingChatbot, setIsLoading, setChosenBot);

  return renderPageContent(isLoading, chosenBot, virtualAgentShowChatbot);
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
