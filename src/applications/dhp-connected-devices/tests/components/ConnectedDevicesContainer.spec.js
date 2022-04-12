import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';
import environment from 'platform/utilities/environment';
import { act } from 'react-dom/test-utils';
import * as HelpersModule from '../../helpers';
import { ConnectedDevicesContainer } from '../../components/ConnectedDevicesContainer';

describe('Connect Devices Container', () => {
  const successUrl = {
    url: `${environment.API_URL}/dhp_connected_devices/?fitbit=success#_=_`,
    //  this needs to be /health-care/connected-devices/?fitbit...
  };
  const failureURl = {
    url: `${environment.API_URL}/dhp_connected_devices/?fitbit=error#_=_`,
  };
  beforeEach(() => {
    sinon.stub(HelpersModule, 'authorizeWithVendor');
  });
  afterEach(() => {
    HelpersModule.authorizeWithVendor.restore();
  });
  it('should render DeviceConnectionSection and DeviceConnectionCards when devices are not connected', async () => {
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(
      await connectedDevicesContainer.findByTestId('connected-devices-section'),
    ).to.exist;
    expect(
      await connectedDevicesContainer.findByTestId(
        'devices-to-connect-section',
      ),
    ).to.exist;
    expect(await connectedDevicesContainer.findByTestId('Fitbit-connect-link'))
      .to.exist;
  });

  it('should render fitbit in connected devices section when connected', () => {
    const oneSupportedDevice = {
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
        oneSupportedDevice,
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

  it('should render success alert when device is connected', async () => {
    HelpersModule.authorizeWithVendor.returns(successUrl);
    const { getByTestId } = render(<ConnectedDevicesContainer />);
    await act(async () => {
      fireEvent.click(getByTestId('Fitbit-connect-link'));
    });
    expect(getByTestId('success-alert')).to.exist;
  });

  it('should render failure alert when device fails to connect', async () => {
    HelpersModule.authorizeWithVendor.returns(failureURl);
    const { getByTestId } = render(<ConnectedDevicesContainer />);
    await act(async () => {
      fireEvent.click(getByTestId('Fitbit-connect-link'));
    });
    expect(getByTestId('failure-alert')).to.exist;
  });

  it('should display a failure alert when an error occurs with api', async () => {
    HelpersModule.authorizeWithVendor.returns('');
    const { getByTestId } = render(<ConnectedDevicesContainer />);
    await act(async () => {
      fireEvent.click(getByTestId('Fitbit-connect-link'));
    });
    expect(getByTestId('failure-alert')).to.exist;
  });
});
