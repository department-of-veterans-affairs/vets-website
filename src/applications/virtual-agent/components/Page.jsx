import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import FloatingBot from './FloatingBot';
import StickyBot from './StickyBot';
import useChosenBot from '../hooks/useChosenBot';

export const renderPageContent = (isLoading, chosenBot) => {
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

function Page({ virtualAgentShowFloatingChatbot = null }) {
  const [chosenBot, setChosenBot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useChosenBot(virtualAgentShowFloatingChatbot, setIsLoading, setChosenBot);

  return renderPageContent(isLoading, chosenBot);
}

Page.propTypes = {
  virtualAgentShowFloatingChatbot: PropTypes.bool,
};

const mapStateToProps = state => ({
  virtualAgentShowFloatingChatbot: toggleValues(state)[
    FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot
  ],
});

export default connect(mapStateToProps)(Page);
