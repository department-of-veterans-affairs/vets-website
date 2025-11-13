import React from 'react';
import { useDispatch } from 'react-redux';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { clearBotSessionStorage } from '../utils/sessionStorage';
import { ACCEPTED } from '../reducers';
import AiDisclaimer from './AiDisclaimer';

function onClick(dispatch) {
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
}

function Disclaimer() {
  return (
    <ul>
      <li>
        Our chatbot can’t help you if you’re experiencing a personal, medical,
        or mental health emergency. Go to the nearest emergency room, dial 988
        and press 1 for mental health support, or call 911 to get medical care
        right away.
        <br />
        <a href="/health-care/health-needs-conditions/mental-health/">
          Learn more about VA mental health services
        </a>
      </li>
      <li>
        Please don’t type any personal information such as your name, address,
        or anything else that can be used to identify you.
      </li>
      <AiDisclaimer />
    </ul>
  );
}

export default function ChatboxDisclaimer() {
  const dispatch = useDispatch();
  return (
    <va-alert status="info">
      <h3 slot="headline">About this chatbot</h3>

      <div data-testid="disclaimer" style={{ width: '100%' }}>
        <Disclaimer />
        <va-button
          id="btnAcceptDisclaimer"
          data-testid="btnAcceptDisclaimer"
          text="Start chat"
          onClick={() => onClick(dispatch)}
        />
      </div>
    </va-alert>
  );
}
