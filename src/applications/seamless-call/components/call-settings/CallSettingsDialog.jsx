import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  audioInputDeviceChanged,
  audioOutputDeviceChanged,
} from '../../actions';
import { AUDIO_INPUT_DEVICE, AUDIO_OUTPUT_DEVICE } from '../../constants';
import SelectField from '../utils/SelectField';

const CallSettingsDialog = ({ onClose }) => {
  const [devices, setDevices] = useState([]);
  const { inputDeviceId, outputDeviceId } = useSelector(({ call }) => call);
  const dispatch = useDispatch();

  const audioDevicesByType = useMemo(
    () =>
      devices.reduce(
        (acc, { kind, deviceId, label }) => {
          const isAudioDevice = [
            AUDIO_INPUT_DEVICE,
            AUDIO_OUTPUT_DEVICE,
          ].includes(kind);
          if (!isAudioDevice) {
            return acc;
          }

          acc[kind] = [...acc[kind], { id: deviceId, label }];
          return acc;
        },
        { [AUDIO_INPUT_DEVICE]: [], [AUDIO_OUTPUT_DEVICE]: [] },
      ),
    [devices],
  );

  const handleAudioInputDeviceChange = useCallback(
    deviceId => dispatch(audioInputDeviceChanged(deviceId)),
    [dispatch],
  );

  const handleAudioOutputDeviceChange = useCallback(
    deviceId => dispatch(audioOutputDeviceChanged(deviceId)),
    [dispatch],
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then(setDevices)
      .catch(console.error); // eslint-disable-line no-console
  }, []);

  if (!devices.length) {
    return null;
  }

  return (
    <VaModal
      visible
      modalTitle="Call Settings"
      clickToClose
      primaryButtonText="OK"
      onPrimaryButtonClick={onClose}
      secondaryButtonText="Cancel"
      onSecondaryButtonClick={onClose}
      onCloseEvent={onClose}
    >
      <SelectField
        id="audioInput"
        label="Select a Microphone"
        value={inputDeviceId}
        onChange={handleAudioInputDeviceChange}
        options={audioDevicesByType[AUDIO_INPUT_DEVICE]}
      />
      <SelectField
        id="audioOutput"
        label="Select a Speaker"
        value={outputDeviceId}
        onChange={handleAudioOutputDeviceChange}
        options={audioDevicesByType[AUDIO_OUTPUT_DEVICE]}
      />
    </VaModal>
  );
};

CallSettingsDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CallSettingsDialog;
