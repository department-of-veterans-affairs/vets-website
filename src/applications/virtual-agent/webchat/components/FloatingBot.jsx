import React from 'react';
import Disclaimer from '../../shared/components/Disclaimer/Disclaimer';
import Chatbox from './Chatbox';

function updateElementById(id, classListAdd, classListRemove) {
  document.getElementById(id).classList.add(classListAdd);
  document.getElementById(id).classList.remove(classListRemove);
}

const showBot = botPosition => {
  if (botPosition === 'corner') {
    updateElementById('chatbot-icon', 'hide', 'unhide');
    updateElementById('corner-bot', 'unhide', 'hide');
  } else {
    updateElementById('chatbot-icon', 'unhide', 'hide');
    updateElementById('corner-bot', 'hide', 'unhide');
  }
};

function ScrollToChatbot() {
  return (
    <div className="jumplink unhide vads-l-col--12 vads-u-display--block medium-screen:vads-u-display--none">
      <a href="#chatbot">Scroll to Chatbot</a>
    </div>
  );
}

function GoToChatbot() {
  return (
    <a
      className="show-on-focus"
      href="#chatbot"
      onClick={() => {
        showBot('corner');
      }}
    >
      Go to Chatbot
    </a>
  );
}

function ChatbotIcon() {
  return (
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
  );
}

function CornerBot() {
  return (
    <>
      <div id="corner-bot" className="fixed-header-chatbot hide">
        <div
          className="close-chatbot-button"
          role="button"
          tabIndex="-1"
          onClick={() => showBot('bottom')}
          aria-hidden="true"
        >
          <a href="#corner-bot">
            <img src="/img/va-x.svg" alt="escape-chatbot" tabIndex="-1" />
          </a>
        </div>
        <Chatbox />
      </div>
    </>
  );
}

export default function FloatingBot() {
  return (
    <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
      <ScrollToChatbot />
      <GoToChatbot />
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4 medium-screen:vads-u-display-none">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7">
          <Disclaimer />
        </div>

        <div
          id="chatbot"
          data-testid="floating-chatbot"
          className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 vads-u-display--block medium-screen:vads-u-display--none"
        >
          <Chatbox />
        </div>

        <ChatbotIcon />
        <CornerBot />
      </div>
    </div>
  );
}
