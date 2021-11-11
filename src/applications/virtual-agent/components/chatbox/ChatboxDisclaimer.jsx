import React from 'react';
import { useDispatch } from 'react-redux';
import { ACCEPTED } from '../../actions';

export const ChatboxDisclaimer = () => {
  const dispatch = useDispatch();
  return (
    <div data-testid={'disclaimer'} style={{ height: '550px', width: '100%' }}>
      <ul>
        <li>
          This virtual agent is still in development and cannot help with
          personal, medical or mental health emergencies. Thank you for
          understanding.
        </li>
        <li>
          We keep a record of all virtual agent conversations, so we ask that
          you do not enter personal information that can be used to identify
          you.
        </li>
      </ul>
      <button
        id="btnAcceptDisclaimer"
        data-testid="btnAcceptDisclaimer"
        className={'usa-button-primary'}
        onClick={() => dispatch({ type: ACCEPTED })}
      >
        Accept
      </button>
    </div>
  );
};

export default ChatboxDisclaimer;
