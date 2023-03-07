import React from 'react';
import { connect } from 'react-redux';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Disclaimer from './Disclaimer';
import ChatBox from '../chatbox/Chatbox';
import FloatingChatBox from '../floating-chatbox/FloatingChatBox';

const virtualAgentShowFloatingChatbot = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot];

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

function Page() {
  // useEffect(() => {
  //   // initiate the event handler
  //   document
  //     .getElementById('chatbot-icon')
  //     .addEventListener('click', () => showBot('bottom'));

  //   document
  //     .getElementById('corner-bot')
  //     .addEventListener('click', () => showBot('corner'));
  // });

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      {FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && (
        <div className="jumplink unhide vads-l-col--12 vads-u-display--block medium-screen:vads-u-display--none">
          <a href="#chatbot">Go to Chatbot</a>
        </div>
      )}
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4 medium-screen:vads-u-display-none">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7">
          <Disclaimer />
        </div>

        <div
          id="chatbot"
          className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 vads-u-display--block medium-screen:vads-u-display--none"
        >
          {FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && (
            <FloatingChatBox />
          )}
          {!FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && <ChatBox />}
        </div>

        <div
          id="chatbot-icon"
          role="button"
          className="chatbot-icon unhide vads-l-col--12 vads-u-display--none medium-screen:vads-u-display--block"
          onClick={() => {
            showBot('corner');
          }}
          aria-hidden="true"
        >
          <a href="#">
            <img src="/img/va-chat.png" alt="openchatbot" />
          </a>
        </div>
        <div id="corner-bot" className="fixed-header-chatbot hide">
          <div
            className="close-chatbot-button"
            role="button"
            onClick={() => {
              showBot('bottom');
            }}
            aria-hidden="true"
          >
            <a href="#">
              <img src="/img/va-x.svg" alt="escape-chatbot" />
            </a>
          </div>
          {FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && (
            <FloatingChatBox />
          )}
          {!FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot && <ChatBox />}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  virtualAgentShowFloatingChatbot: virtualAgentShowFloatingChatbot(state),
});

export default connect(mapStateToProps)(Page);
