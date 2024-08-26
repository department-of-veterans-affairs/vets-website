import { AUDIO_INPUT_DEVICE, AUDIO_OUTPUT_DEVICE } from '../../../../constants';

export const findAudioInputSelector = view =>
  view.findByRole('combobox', { name: 'Select a Microphone' });

export const findAudioOutputSelector = view =>
  view.findByRole('combobox', { name: 'Select a Speaker' });

export const getOption = (view, name) => view.getByRole('option', { name });

const filterDevicesByKind = (devices, kind) =>
  devices.filter(d => d.kind === kind);

export const getAudioInputDevices = devices =>
  filterDevicesByKind(devices, AUDIO_INPUT_DEVICE);

export const getAudioOutputDevices = devices =>
  filterDevicesByKind(devices, AUDIO_OUTPUT_DEVICE);
