import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { ACCEPTED, ACCEPTED_SKILL } from '../../actions';
import { clearBotSessionStorage } from './utils';

export const ChatboxDisclaimer = () => {
  const dispatch = useDispatch();
  return (
    <va-alert status="info">
      <h3 slot="headline">About this chatbot</h3>

      <div data-testid="disclaimer" style={{ width: '100%' }}>
        <ul>
          <li>
            Our chatbot can’t help you if you’re experiencing a personal,
            medical, or mental health emergency. Go to the nearest emergency
            room, dial 988 and press 1 for mental health support, or call 911 to
            get medical care right away.
            <br />
            <a href="/health-care/health-needs-conditions/mental-health/">
              Learn more about VA mental health services
            </a>
          </li>
          <li>
            Please don’t type any personal information such as your name,
            address, or anything else that can be used to identify you.
          </li>
        </ul>
        <button
          type="button"
          id="btnAcceptDisclaimer"
          data-testid="btnAcceptDisclaimer"
          className="usa-button-primary"
          onClick={() => {
            recordEvent({
              action: 'click',
              'button-type': 'default',
              event: 'cta-button-click',
              'button-click-label': 'Start Chat',
              'button-background-color': 'blue',
              time: new Date(),
            });
            clearBotSessionStorage(true);
            dispatch({ type: ACCEPTED });
          }}
        >
          Start chat
        </button>
      </div>
    </va-alert>
  );
};

export const ChatboxDisclaimerForSkills = props => {
  const dispatch = useDispatch();
  const currentSkillName = useSelector(state => state.virtualAgentData.currentSkillName);

  if (currentSkillName) {
    document
      .querySelectorAll('div.virtual-agent-header')[0]
      .classList.add('vads-u-background-color--secondary-darkest');
    document.querySelectorAll('div.virtual-agent-header h2')[0].textContent = `VA chatbot: ${currentSkillName} (beta)`;
    //document.querySelectorAll('.webchat__send-box-text-box__input')[0].placeholder = `Type your message for ${currentSkillName.toLowerCase()}`;
  } else {
    document
      .querySelectorAll('div.virtual-agent-header')[0]
      .classList.add('vads-u-background-color--primary-darkest');
    document.querySelectorAll('div.virtual-agent-header h2')[0].textContent = 'VA chatbot (beta)';
    //document.querySelectorAll('.webchat__send-box-text-box__input')[0].placeholder = 'Type your message';
  }

  return (
    <va-alert status="info">
      <h3 slot="headline">About the {currentSkillName} Bot</h3>

      <div data-testid="disclaimerForSkill" style={{ width: '100%' }}>
        <ul>
          <li>
            This area of the chatbot is specialized to handle your questions
            about viewing {currentSkillName}, tracking them, and requesting
            refills. When you are finished exploring this topic, click the
            "Exit" button at the top of the chat to return to the main chatbot.
          </li>
        </ul>
        <button
          type="button"
          id="btnAcceptDisclaimerForSkill"
          data-testid="btnAcceptDisclaimerForSkill"
          className="usa-button-primary"
          onClick={() => {
            recordEvent({
              action: 'click',
              'button-type': 'default',
              event: 'cta-button-click',
              'button-click-label': 'Continue',
              'button-background-color': 'maroon',
              time: new Date(),
            });
            // clearBotSessionStorage(true);
            dispatch({ type: ACCEPTED_SKILL });
            document
              .querySelectorAll('div.virtual-agent-header')[0]
              .classList.remove('vads-u-background-color--secondary-darkest');
            document.querySelectorAll('div.virtual-agent-header h2')[0].textContent = 'VA chatbot (beta)';
          }}
        >
          Continue
        </button>
      </div>
    </va-alert>
  );
};

export default ChatboxDisclaimer;
// export default ChatboxDisclaimerForSkills;
