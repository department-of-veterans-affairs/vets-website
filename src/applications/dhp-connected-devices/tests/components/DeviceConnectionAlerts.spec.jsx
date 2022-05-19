import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DeviceConnectionSucceededAlert,
  DeviceConnectionFailedAlert,
  DeviceConnectionAlert,
} from '../../components/DeviceConnectionAlerts';

describe('Successful device connection alert', () => {
  it('shows a success message', () => {
    const { getByTestId } = render(<DeviceConnectionSucceededAlert />);
    expect(getByTestId('success-alert')).to.exist;
  });
});

describe('Failed device connect alert', () => {
  it('shows a failure message', () => {
    const { getByTestId } = render(<DeviceConnectionFailedAlert />);
    expect(getByTestId('failure-alert')).to.exist;
  });
});

describe('Device connection alerts', () => {
  it('should show a success alert when given success params', () => {
    const { getByTestId, getByText } = render(
      <DeviceConnectionAlert
        testId="success-alert"
        status="success"
        headline="Device connected"
        description="Your device is now connected"
      />,
    );
    expect(getByTestId('success-alert')).to.exist;
    expect(getByText('Device connected')).to.exist;
    expect(getByText('Your device is now connected')).to.exist;
  });
});
