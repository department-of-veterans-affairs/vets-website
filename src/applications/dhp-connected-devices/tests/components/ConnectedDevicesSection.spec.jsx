import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
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
  it('logs clicked when clicking disconnect', async () => {
    const devices = [
      {
        vendor: 'Apple Watch',
        key: 'apple',
        authUrl: `/apple`,
        disconnectUrl: 'placeholder',
        connected: true,
      },
    ];
    const { getByTestId, getByText, getByRole } = render(
      <ConnectedDevicesSection
        connectedDevices={devices}
        successAlert={false}
        failureAlert={false}
      />,
    );
    const disconnectBtn = getByRole('button', { name: 'Disconnect' });
    await fireEvent.click(disconnectBtn);
    const modal = getByTestId('disconnect-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('modalTitle')).to.eq('Disconnect device');
    expect(
      getByText(
        'Disconnecting your Apple Watch will stop sharing data with the VA.',
      ),
    ).to.exist;
    expect(modal.getAttribute('primaryButtonText')).to.eq('Disconnect device');
    expect(modal.getAttribute('secondaryButtonText')).to.eq('Go back');
  });
});
