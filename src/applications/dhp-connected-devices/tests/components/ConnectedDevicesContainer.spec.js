import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { ConnectedDevicesContainer } from '../../components/ConnectedDevicesContainer';

describe('Connect Devices Container', () => {
  it('should render fitbit and freestyle in devices to connect section when they are not connected', () => {
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(connectedDevicesContainer.findByTestId('Fitbit-connect-link')).to
      .exist;
    expect(
      connectedDevicesContainer.findByTestId('Freestyle Libre-connect-link'),
    ).to.exist;
  });

  it('should render fitbit in connected devices section when connected', () => {
    const initialState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: true,
        },
      ],
    };
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      {
        initialState,
      },
    );
    expect(connectedDevicesContainer.findByTestId('Fitbit-connect-link')).to.be
      .empty;
    expect(connectedDevicesContainer.findByTestId('Fitbit-disconnect-link')).to
      .exist;
  });

  it('should render "You do not have any devices connected" when no devices are connected', () => {
    const noDevicesConnectedState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: false,
        },
      ],
    };

    const noConnectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      { noDevicesConnectedState },
    );

    expect(
      noConnectedDevicesContainer.findByText(
        'You do not have any devices connected',
      ),
    ).to.exist;
  });

  it('should render "You have connected all supported devices" when all supported devices are connected', () => {
    const allDevicesConnectedState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: true,
        },
      ],
    };

    const allConnectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      { allDevicesConnectedState },
    );

    expect(
      allConnectedDevicesContainer.findByTestId('no-devices-connected-alert'),
    ).to.exist;

    const oneDeviceConnectedState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: true,
        },
        {
          vendor: 'Fitbit2',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: false,
        },
      ],
    };

    const oneConnectedDeviceContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      { oneDeviceConnectedState },
    );

    expect(
      oneConnectedDeviceContainer.findByTestId('all-devices-connected-alert'),
    ).to.be.empty;
  });

  it('should render success alert when successAlert is set to true', () => {
    const initialState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: true,
        },
      ],
      successAlert: true,
    };
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      {
        initialState,
      },
    );
    expect(connectedDevicesContainer.findByTestId('success-alert')).to.exist;
  });

  it('should render failure alert when failureAlert is set to true', () => {
    const initialState = {
      connectedDevices: [
        {
          vendor: 'Fitbit',
          authUrl: 'path/to/vetsapi/fitbit/connect/method',
          disconnectUrl: 'placeholder',
          connected: false,
        },
      ],
      failureAlert: true,
    };
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
      {
        initialState,
      },
    );
    expect(connectedDevicesContainer.findByTestId('failure-alert')).to.exist;
  });
  it('should render success alert when device is connected', () => {
    const { getByTestId } = render(<ConnectedDevicesContainer />);
    fireEvent.click(getByTestId('Fitbit-connect-link'));
    expect(getByTestId('success-alert')).to.exist;
  });
});
