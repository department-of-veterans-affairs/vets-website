import React from 'react';
import Disclaimer from './Disclaimer';
import Chatbox from '../chatbox/Chatbox';

export default function Page() {
  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4 medium-screen:vads-u-display-none">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7">
          <Disclaimer />
        </div>
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 vads-u-display--block medium-screen:vads-u-display--none">
          <Chatbox />
        </div>
        <div
          id="chatbot-icon"
          className="chatbot-icon unhide"
          onClick={() => {
            document.getElementById('chatbot-icon').classList.add('hide');
            document.getElementById('chatbot-icon').classList.remove('unhide');
            document.getElementById('corner-bot').classList.add('unhide');
            document.getElementById('corner-bot').classList.remove('hide');
          }}
        >
          <a href="#">
            <img src="/img/va-chat.svg" alt="openchatbot" />
          </a>
        </div>
        <div id="corner-bot" className="fixed-header-chatbot hide">
          <div
            className="close-chatbot-button"
            onClick={() => {
              document.getElementById('chatbot-icon').classList.add('unhide');
              document.getElementById('chatbot-icon').classList.remove('hide');
              document.getElementById('corner-bot').classList.add('hide');
              document.getElementById('corner-bot').classList.remove('unhide');
            }}
          >
            <a href="#">
              <img src="/img/va-x.svg" alt="escape-chatbot" />
            </a>
          </div>
          <Chatbox />
        </div>
      </div>
    </div>
  );
}
