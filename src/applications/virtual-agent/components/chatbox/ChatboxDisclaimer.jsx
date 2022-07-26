import React from 'react';
import { useDispatch } from 'react-redux';
import { ACCEPTED } from '../../actions';
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
            room or call 911 to get medical care right away.
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
          id="btnAcceptDisclaimer"
          data-testid="btnAcceptDisclaimer"
          className="usa-button-primary"
          onClick={() => {
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

export default ChatboxDisclaimer;
