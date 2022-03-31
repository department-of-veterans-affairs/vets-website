import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import {
  DeviceConnectionSucceededAlert,
  DeviceConnectionFailedAlert,
} from '../../components/DeviceConnectionAlerts';

describe('Successful device connection alert', () => {
  it('shows a success message', () => {
    const screen = renderInReduxProvider(<DeviceConnectionSucceededAlert />);
    expect(screen.getByText(/Device Connected/)).to.exist;
  });
});

describe('Failed device connect alert', () => {
  it('shows a failure message', () => {
    const screen = renderInReduxProvider(<DeviceConnectionFailedAlert />);
    expect(screen.getByText(/We couldn't connect your device/)).to.exist;
  });
});
