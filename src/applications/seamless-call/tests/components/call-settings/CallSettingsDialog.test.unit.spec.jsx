import { waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import CallSettingsDialog from '../../../components/call-settings/CallSettingsDialog';
import { DEFAULT_AUDIO_DEVICE_ID } from '../../../constants';
import { renderWithReduxProvider } from '../../contexts/test-helpers/CallContextProviderTestHelpers';
import {
  createDevice,
  createTestDeviceList,
  defineNavigatorMediaDevices,
} from '../../test-helpers/CallTestFactories';
import {
  findAudioInputSelector,
  findAudioOutputSelector,
  getAudioInputDevices,
  getAudioOutputDevices,
  getOption,
} from './test-helpers/CallSettingsDialogTestHelpers';

describe('CallSettingsDialog', () => {
  const doRender = ({ state = {}, props = {} } = {}) => {
    const testProps = {
      onClose: sinon.stub(),
      ...props,
    };

    const testState = {
      inputDeviceId: DEFAULT_AUDIO_DEVICE_ID,
      outputDeviceId: DEFAULT_AUDIO_DEVICE_ID,
      ...state,
    };
    return renderWithReduxProvider(<CallSettingsDialog {...testProps} />, {
      state: testState,
    });
  };

  afterEach(sinon.restore);

  describe('audio devices', () => {
    const devices = createTestDeviceList();

    beforeEach(() => {
      defineNavigatorMediaDevices(devices);
    });

    it('renders a dropdown for selecting the audio input device', async () => {
      const audioInputDevices = getAudioInputDevices(devices);

      const { view } = doRender({
        inputDeviceId: audioInputDevices[0].deviceId,
      });

      const audioInputSelector = await findAudioInputSelector(view);
      expect(audioInputSelector).to.have.value(audioInputDevices[0].deviceId);

      audioInputDevices.forEach(({ label }) =>
        getOption(within(audioInputSelector), label),
      );
    });

    it('allows selecting the audio input device', async () => {
      const { view, store } = doRender();

      const audioInputSelector = await findAudioInputSelector(view);
      const audioInputDevices = getAudioInputDevices(devices);
      const { label, deviceId } = audioInputDevices[0];
      await waitFor(() => userEvent.selectOptions(audioInputSelector, label));
      const { call } = store.getState();
      expect(call.inputDeviceId).to.eql(deviceId);
    });

    it('renders a dropdown for selecting the audio output device', async () => {
      const audioOutputDevices = getAudioOutputDevices(devices);

      const { view } = doRender({
        outputDeviceId: audioOutputDevices[0].deviceId,
      });

      const audioOutputSelector = await findAudioOutputSelector(view);
      expect(audioOutputSelector).to.have.value(audioOutputDevices[0].deviceId);

      audioOutputDevices.forEach(({ label }) =>
        getOption(within(audioOutputSelector), label),
      );
    });

    it('allows selecting the audio output device', async () => {
      const { view, store } = doRender();

      const audioOutputSelector = await findAudioOutputSelector(view);
      const audioOutputDevices = getAudioOutputDevices(devices);
      const { label, deviceId } = audioOutputDevices[0];
      await waitFor(() => userEvent.selectOptions(audioOutputSelector, label));
      const { call } = store.getState();
      expect(call.inputDeviceId).to.eql(deviceId);
    });
  });

  describe('video devices', () => {
    it('ignores video devices', async () => {
      const devices = [createDevice({ kind: 'videoinput' })];
      defineNavigatorMediaDevices(devices);

      const { view } = doRender();

      await findAudioInputSelector(view);
    });
  });
});
