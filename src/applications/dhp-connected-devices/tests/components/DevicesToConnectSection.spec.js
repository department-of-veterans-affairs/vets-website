import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DevicesToConnectSection } from '../../components/DevicesToConnectSection';

describe('Devices to Connect Section', () => {
  it('renders disconnected devices in the devices to connect section', async () => {
    const devices = [
      {
        vendor: 'Apple Watch',
        key: 'apple',
        authUrl: `/apple`,
        disconnectUrl: 'placeholder',
        connected: true,
      },
      {
        vendor: 'Libre View',
        key: 'libre',
        authUrl: `/libre`,
        disconnectUrl: 'placeholder',
        connected: false,
      },
    ];

    const section = render(
      <DevicesToConnectSection connectedDevices={devices} />,
    );

    expect(section.getByTestId('libre-connect-link')).to.exist;
    expect(section.queryByTestId('apple-connect-link')).to.not.exist;
  });
});
