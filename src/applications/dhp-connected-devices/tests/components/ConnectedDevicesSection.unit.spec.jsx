import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ConnectedDevicesSection } from '../../components/ConnectedDevicesSection';

describe('Connect Devices Section', () => {
  it('renders connected device in the connected devices section', async () => {
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
      <ConnectedDevicesSection
        connectedDevices={devices}
        successAlert={false}
        failureAlert={false}
      />,
    );

    expect(section.getByTestId('apple-disconnect-link')).to.exist;
    expect(section.queryByTestId('libre-disconnect-link')).to.not.exist;
  });
});
