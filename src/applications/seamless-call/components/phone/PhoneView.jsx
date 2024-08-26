import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import useCallContext from '../../contexts/useCallContext';
import CallActionButton from '../buttons/CallActionButton';
import CallSettingsButton from '../call-settings/CallSettingsButton';
import CallStateView from './CallStateView';
import CalleeLargeIcon from './CalleeLargeIcon';
import CalleeSmallIcon from './CalleeSmallIcon';
import HideKeypadButton from '../buttons/keypad/HideKeypadButton';
import Key0 from '../buttons/keypad/Key0';
import Key1 from '../buttons/keypad/Key1';
import Key2 from '../buttons/keypad/Key2';
import Key3 from '../buttons/keypad/Key3';
import Key4 from '../buttons/keypad/Key4';
import Key5 from '../buttons/keypad/Key5';
import Key6 from '../buttons/keypad/Key6';
import Key7 from '../buttons/keypad/Key7';
import Key8 from '../buttons/keypad/Key8';
import Key9 from '../buttons/keypad/Key9';
import HashKey from '../buttons/keypad/HashKey';
import StarKey from '../buttons/keypad/StarKey';
import MuteButton from '../buttons/MuteButton';
import ShowKeypadButton from '../buttons/ShowKeypadButton';
import EndToEndEncryptedNotice from './End2EndEncryptionNotice';

export const PhoneView = ({ calleeSipUri, calleeName, extraHeaders }) => {
  const { connect, disconnect } = useCallContext();
  const { keypadPresses, isKeypadVisible } = useSelector(({ call }) => call);

  useEffect(
    () => {
      connect();

      return disconnect;
    },
    [connect, disconnect],
  );

  return (
    <div className="vads-u-background-color--primary-alt-lightest vads-u-padding-top--2 vads-u-padding-bottom--7">
      <div className="vads-u-display--flex vads-u-justify-content--flex-end vads-u-padding-right--4 vads-u-margin-bottom--2">
        <CallSettingsButton />
      </div>
      <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-align-items--center">
        <div className="vads-u-margin-bottom--2">
          <EndToEndEncryptedNotice />
        </div>
        {isKeypadVisible ? (
          <>
            <div className="vads-u-margin-bottom--2">
              <CalleeSmallIcon />
            </div>
            <div className="vads-u-font-size--h3">{calleeName}</div>
            <CallStateView />
            <hr className="full-width vads-u-margin-y--1" />
            <div
              className="vads-u-margin-bottom--2"
              data-testid="keypadPresses"
            >
              {keypadPresses}
            </div>
            <div className="grid grid-cols-3 gap--3">
              <Key1 />
              <Key2 />
              <Key3 />
              <Key4 />
              <Key5 />
              <Key6 />
              <Key7 />
              <Key8 />
              <Key9 />
              <StarKey />
              <Key0 />
              <HashKey />
              <div className="col-start-2">
                <CallActionButton
                  calleeSipUri={calleeSipUri}
                  extraHeaders={extraHeaders}
                />
              </div>
              <HideKeypadButton />
            </div>
          </>
        ) : (
          <>
            <div className="vads-u-margin-bottom--4">
              <CalleeLargeIcon />
            </div>
            <div className="vads-u-font-size--h3">{calleeName}</div>
            <div className="vads-u-margin-bottom--4">
              <CallStateView />
            </div>
            <div className="vads-u-display--flex gap--3">
              <MuteButton />
              <CallActionButton
                calleeSipUri={calleeSipUri}
                extraHeaders={extraHeaders}
              />
              <ShowKeypadButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

PhoneView.propTypes = {
  calleeName: PropTypes.string.isRequired,
  calleeSipUri: PropTypes.string.isRequired,
  extraHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PhoneView;
