import React from 'react';
import { expect } from 'chai';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { fireEvent, render } from '@testing-library/react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { DeviceDisconnectionCard } from '../../components/DeviceDisconnectionCard';

describe('Device disconnection card', () => {
  const device = {
    name: 'Test Vendor',
    key: 'test-vendor',
    disconnectUrl: 'path/to/test-disconnect',
  };
  function getDisconnectModal(targetScreen) {
    return targetScreen.queryByTestId('disconnect-modal');
  }
  let disconnectBtn;
  let screen;
  beforeEach(async () => {
    screen = render(<DeviceDisconnectionCard device={device} />);
    disconnectBtn = screen.getByRole('button', {
      name: 'Disconnect Test Vendor',
      key: 'test-vendor',
    });
  });

  describe('Device disconnection card content', () => {
    it('Renders vendors name', () => {
      expect(screen.getByText(/Test Vendor/)).to.exist;
    });
    it('Has aria label for screen reader users', () => {
      expect(
        screen
          .getByTestId('test-vendor-disconnect-link')
          .getAttribute('aria-label'),
      ).to.equal('Disconnect Test Vendor');
    });
    it('Should not open Disconnect modal on tab press', async () => {
      const tabKeyCode = 9;
      disconnectBtn.focus();
      fireEvent.keyDown(disconnectBtn, { keyCode: tabKeyCode });
      expect(getDisconnectModal(screen)).to.not.exist;
    });
    it('Renders vendor terms and conditions', () => {
      const card = renderInReduxProvider(
        <DeviceDisconnectionCard device={{ name: 'Fitbit', key: 'fitbit' }} />,
      );
      expect(card.getByTestId('fitbit-terms-and-conditions')).to.exist;
      expect(card.getByTestId('fitbit-terms-and-conditions-content')).to.exist;
    });
  });

  describe('Device disconnection card modal', () => {
    let modal;
    beforeEach(async () => {
      fireEvent.click(disconnectBtn);
      modal = getDisconnectModal(screen);
    });
    it('Should show modal when Disconnect is clicked', async () => {
      expect(modal).to.exist;
      expect(modal.getAttribute('modal-title')).to.eq('Disconnect device');
      expect(
        screen.getByText(
          'Disconnecting your Test Vendor will stop sharing data with the VA.',
        ),
      ).to.exist;
      expect(modal.getAttribute('primary-button-text')).to.eq(
        'Disconnect device',
      );
      expect(modal.getAttribute('secondary-button-text')).to.eq('Cancel');
    });
    it("Should close modal when 'Cancel' button is clicked", async () => {
      const cancelBtn = modal.__events.secondaryButtonClick;
      await cancelBtn();
      expect(getDisconnectModal(screen)).to.not.exist;
    });
    it("Should close modal when 'X' button is clicked", async () => {
      const xBtn = modal.__events.closeEvent;
      await xBtn();
      expect(getDisconnectModal(screen)).to.not.exist;
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
      expect(getDisconnectModal(screen)).to.not.exist;
      expect(global.window.location.href).to.eq(
        `${environment.API_URL}/dhp_connected_devices${device.disconnectUrl}`,
      );
    });
  });
});
