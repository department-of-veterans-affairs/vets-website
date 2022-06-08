import React from 'react';
import { expect } from 'chai';
import environment from 'platform/utilities/environment';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { render, fireEvent } from '@testing-library/react';
import { DeviceDisconnectionCard } from '../../components/DeviceDisconnectionCard';

describe('Device disconnection card', () => {
  it('Renders vendors name', () => {
    const card = renderInReduxProvider(
      <DeviceDisconnectionCard
        device={{ name: 'Test Vendor' }}
        onClickHandler="www.google.com"
      />,
    );

    expect(card.getByText(/Test Vendor/)).to.exist;
  });
});

describe('Device disconnection card modal', () => {
  let screen;
  let modal;
  const device = {
    name: 'Test Vendor',
    key: 'test',
    disconnectUrl: 'path/to/test-disconnect',
  };
  beforeEach(async () => {
    screen = render(<DeviceDisconnectionCard device={device} />);
    const disconnectBtn = screen.getByRole('button', { name: 'Disconnect' });
    fireEvent.click(disconnectBtn);
    modal = screen.getByTestId('disconnect-modal');
  });

  it('Should show modal when Disconnect is clicked', async () => {
    expect(modal).to.exist;
    expect(modal.getAttribute('modalTitle')).to.eq('Disconnect device');
    expect(
      screen.getByText(
        'Disconnecting your Test Vendor will stop sharing data with the VA.',
      ),
    ).to.exist;
    expect(modal.getAttribute('primaryButtonText')).to.eq('Disconnect device');
    expect(modal.getAttribute('secondaryButtonText')).to.eq('Go back');
  });
  it("Should close modal when 'Go back' button is clicked", async () => {
    const goBackBtn = modal.__events.secondaryButtonClick;
    await goBackBtn();
    expect(screen.queryByTestId('disconnect-modal')).to.not.exist;
  });
  it("Should close modal when 'X' button is clicked", async () => {
    const xBtn = modal.__events.closeEvent;
    await xBtn();
    expect(screen.queryByTestId('disconnect-modal')).to.not.exist;
  });
  it("Should close modal when 'Disconnect device' button is clicked and redirect to disconnect url", async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        assign: () => {},
        href: '/',
      },
    });
    const disconnectDeviceBtn = modal.__events.primaryButtonClick;
    await disconnectDeviceBtn();
    expect(screen.queryByTestId('disconnect-modal')).to.not.exist;
    expect(global.window.location.href).to.eq(
      `${environment.API_URL}/dhp_connected_devices${device.disconnectUrl}`,
    );
  });
});
