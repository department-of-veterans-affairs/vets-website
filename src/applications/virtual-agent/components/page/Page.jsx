import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Disclaimer from './Disclaimer';
import ChatBox from '../chatbox/Chatbox';

const showBot = botPosition => {
  if (botPosition === 'corner') {
    document.getElementById('chatbot-icon').classList.add('hide');
    document.getElementById('chatbot-icon').classList.remove('unhide');
    document.getElementById('corner-bot').classList.add('unhide');
    document.getElementById('corner-bot').classList.remove('hide');
  } else {
    document.getElementById('chatbot-icon').classList.add('unhide');
    document.getElementById('chatbot-icon').classList.remove('hide');
    document.getElementById('corner-bot').classList.add('hide');
    document.getElementById('corner-bot').classList.remove('unhide');
  }
};

const renderChatBox = () => {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

const renderStickyBot = () => {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="jumplink unhide vads-l-col--12 vads-u-display--block medium-screen:vads-u-display--none">
        <a href="#chatbot">Scroll to Chatbot</a>
      </div>
      <a
        className="show-on-focus"
        href="#chatbot"
        onClick={() => {
          showBot('corner');
        }}
      >
        Go to Chatbot
      </a>
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4 medium-screen:vads-u-display-none">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7">
          <Disclaimer />
        </div>

        <div
          id="chatbot"
          className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 vads-u-display--block medium-screen:vads-u-display--none"
        >
          <ChatBox />
        </div>

        <div
          id="chatbot-icon"
          tabIndex="-1"
          role="button"
          className="chatbot-icon unhide vads-l-col--12 vads-u-display--none medium-screen:vads-u-display--block"
          onClick={() => {
            showBot('corner');
          }}
          aria-hidden="true"
        >
          <a href="#chatbot-icon">
            <img src="/img/va-chat.png" alt="openchatbot" />
          </a>
        </div>
        <div id="corner-bot" className="fixed-header-chatbot hide">
          <div
            className="close-chatbot-button"
            role="button"
            tabIndex="-1"
            onClick={() => {
              showBot('bottom');
            }}
            aria-hidden="true"
          >
            <a href="#corner-bot">
              <img src="/img/va-x.svg" alt="escape-chatbot" tabIndex="-1" />
            </a>
          </div>
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

function Page({ virtualAgentShowFloatingChatbot = null }) {
  const [chosenBot, setChosenBot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  let bot = '';

  useEffect(
    () => {
      // if (virtualAgentShowFloatingChatbot) {
      setIsLoading(false);
      if (virtualAgentShowFloatingChatbot) {
        setChosenBot('sticky');
      } else {
        setChosenBot('default');
      }
      // }
      // else {
      //   setIsLoading(true);
      // }
    },
    [virtualAgentShowFloatingChatbot],
  );

  if (chosenBot === 'sticky') {
    bot = renderStickyBot();
  } else if (chosenBot === 'default') {
    bot = renderChatBox();
  } else {
    bot = '';
  }

  if (isLoading) {
    return <va-loading-indicator />;
  }
  return bot;
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
