import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DeviceConnectionAlert } from '../../components/DeviceConnectionAlerts';

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
