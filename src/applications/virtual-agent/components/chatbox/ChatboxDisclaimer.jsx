import React from 'react';
import { useDispatch } from 'react-redux';
import { ACCEPTED } from '../../actions';

export const ChatboxDisclaimer = () => {
  const dispatch = useDispatch();
  return (
    <va-alert status="info">
      <h3 slot="headline">Disclaimer</h3>

      <div data-testid={'disclaimer'} style={{ width: '100%' }}>
        <ul>
          <li>
            This virtual agent is still in development and cannot help with
            personal, medical or mental health emergencies. Thank you for
            understanding.
          </li>
          <li>
            We ask that you do not enter personal information that can be used
            to identify you.
          </li>
        </ul>
        <button
          id="btnAcceptDisclaimer"
          data-testid="btnAcceptDisclaimer"
          className={'usa-button-primary'}
          onClick={() => dispatch({ type: ACCEPTED })}
        >
          Accept & Start Chat
        </button>
      </div>
    </va-alert>
  );
};

export default ChatboxDisclaimer;
