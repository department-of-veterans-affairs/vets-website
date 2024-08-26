import React from 'react';

import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import PhoneView from '../../../components/phone/PhoneView';
import { CONNECTED, INITIATED } from '../../../constants';
import { renderWithCallContextProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import {
  createCallContext,
  createTestDeviceList,
  defineNavigatorMediaDevices,
} from '../../test-helpers/CallTestFactories';
import {
  getCallInitiatedText,
  getCalleeName,
} from '../../utils/test-helpers/CallStateTestHelpers';
import {
  getHangUpButton,
  queryCallButton,
} from '../buttons/test-helpers/CallActionButtonTestHelpers';
import { getCallSettingsButton } from '../call-settings/test-helpers/CallSettingsButtonTestHelpers';
import {
  findAudioInputSelector,
  findAudioOutputSelector,
  getAudioInputDevices,
  getAudioOutputDevices,
} from '../call-settings/test-helpers/CallSettingsDialogTestHelpers';
import {
  getE2eEncryptedNotice,
  getHashKey,
  getHideKeypadButton,
  getKey0,
  getKey1,
  getKey2,
  getKey3,
  getKey4,
  getKey5,
  getKey6,
  getKey7,
  getKey8,
  getKey9,
  getKeypadPresses,
  getMuteButton,
  getShowKeypadButton,
  getStarKey,
} from './test-helpers/PhoneViewTestHelpers';

describe('PhoneView', () => {
  const doRender = ({ props = {}, state = {}, callContext = {} } = {}) => {
    const testProps = {
      calleeSipUri: '',
      calleeName: '',
      extraHeaders: [],
      ...props,
    };
    const devices = createTestDeviceList();
    const testCallContext = createCallContext({
      devices,
      inputDeviceId: getAudioInputDevices(devices)[0].deviceId,
      outputDeviceId: getAudioOutputDevices(devices)[0].deviceId,
      ...callContext,
    });
    return renderWithCallContextProvider(<PhoneView {...testProps} />, {
      callContext: testCallContext,
      state,
    });
  };

  it('connects and disconnects to the SIP transport socket during the render lifecycle', () => {
    const { view, callContext } = doRender();
    sinon.assert.calledOnce(callContext.connect);

    view.unmount();
    sinon.assert.calledOnce(callContext.disconnect);
  });

  it('renders an "E2E encrypted" notice', () => {
    const { view } = doRender();

    getE2eEncryptedNotice(view);
  });

  it('renders a button to call/hang up', () => {
    const { view } = doRender({
      state: { state: INITIATED },
    });

    getHangUpButton(view);
    expect(queryCallButton(view)).to.be.null;
  });

  it('renders a call state display', () => {
    const { view } = doRender({
      state: { state: INITIATED },
    });

    getCallInitiatedText(view);
  });

  it('renders a call settings dialog', async () => {
    defineNavigatorMediaDevices();
    const { view } = doRender();

    userEvent.click(getCallSettingsButton(view));

    await findAudioInputSelector(view);
    await findAudioOutputSelector(view);
  });

  describe('when the call state is active', () => {
    const activeCall = {
      state: CONNECTED,
    };

    it('renders the callee name', () => {
      const calleeName = 'Bob';
      const { view } = doRender({
        state: activeCall,
        props: { calleeName },
      });

      getCalleeName(view, calleeName);
    });

    it('renders a mute button', () => {
      const { view } = doRender({ state: activeCall });

      getMuteButton(view);
    });

    it('displays the current list of keypadPresses', () => {
      const { view } = doRender({
        state: {
          ...activeCall,
          keypadPresses: ['1', '2', '3'],
          isKeypadVisible: true,
        },
      });

      getKeypadPresses(view, '123');
    });

    it('displays the show keypad button when the keypad is not visible', () => {
      const { view } = doRender({
        state: {
          ...activeCall,
          isKeypadVisible: false,
        },
      });

      getShowKeypadButton(view);
    });

    describe('when the keypad is visible', () => {
      const keypadVisible = {
        ...activeCall,
        isKeypadVisible: true,
      };

      it('displays the hide keypad button', () => {
        const { view } = doRender({ state: keypadVisible });

        getHideKeypadButton(view);
      });

      it('renders keypad buttons', () => {
        const { view } = doRender({ state: keypadVisible });

        getKey1(view);
        getKey2(view);
        getKey3(view);
        getKey4(view);
        getKey5(view);
        getKey6(view);
        getKey7(view);
        getKey8(view);
        getKey9(view);
        getKey0(view);
        getStarKey(view);
        getHashKey(view);
      });
    });
  });
});
