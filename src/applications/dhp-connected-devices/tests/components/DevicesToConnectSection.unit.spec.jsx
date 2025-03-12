import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DevicesToConnectSection } from '../../components/DevicesToConnectSection';

describe('Devices to Connect Section', () => {
  it('renders disconnected devices in the devices to connect section when connectionAvailable', async () => {
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
      <DevicesToConnectSection
        connectedDevices={devices}
        connectionAvailable
        hasLoaded
      />,
    );

    expect(section.getByTestId('libre-connect-link')).to.exist;
    expect(section.queryByTestId('apple-connect-link')).to.not.exist;
  });

  it('renders connection unavailable alert when connectionAvailable is false', async () => {
    const devices = [];

    const section = render(
      <DevicesToConnectSection
        connectedDevices={devices}
        connectionAvailable={false}
        hasLoaded
      />,
    );

    expect(section.getByTestId('connection-unavailable-alert')).to.exist;
  });

  it('renders loading indicator when hasLoaded is false', async () => {
    const section = render(
      <DevicesToConnectSection
        connectedDevices={[]}
        connectionAvailable
        hasLoaded={false}
      />,
    );

    expect(section.getByTestId('va-loading-indicator')).to.exist;
    expect(section.queryByTestId('connection-unavailable-alert')).to.not.exist;
  });
});
