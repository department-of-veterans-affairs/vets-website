import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';
import environment from 'platform/utilities/environment';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { ConnectedDevicesContainer } from '../../components/ConnectedDevicesContainer';
import {
  CONNECTION_FAILED_STATUS,
  CONNECTION_SUCCESSFUL_STATUS,
  DISCONNECTION_FAILED_STATUS,
  DISCONNECTION_SUCCESSFUL_STATUS,
} from '../../constants/alerts';

const noDevicesConnectedState = {
  devices: [
    {
      name: 'Vendor 1',
      key: 'vendor-1',
      authUrl: 'path/to/vetsapi/vendor-1/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
      connected: false,
    },
    {
      name: 'Vendor 2',
      key: 'vendor-2',
      authUrl: 'path/to/vetsapi/vendor-2/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
      connected: false,
    },
  ],
};

const oneDeviceConnectedState = {
  devices: [
    {
      name: 'Vendor 1',
      key: 'vendor-1',
      authUrl: 'path/to/vetsapi/vendor-1/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
      connected: true,
    },
    {
      name: 'Vendor 2',
      key: 'vendor-2',
      authUrl: 'path/to/vetsapi/vendor-2/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
      connected: false,
    },
  ],
};

const twoDevicesConnectedState = {
  devices: [
    {
      name: 'Vendor 1',
      key: 'vendor-1',
      authUrl: 'path/to/vetsapi/vendor-1/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
      connected: true,
    },
    {
      name: 'Vendor 2',
      key: 'vendor-2',
      authUrl: 'path/to/vetsapi/vendor-2/connect/method',
      disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
      connected: true,
    },
  ],
};

describe('Connect Devices Container', () => {
  it('should render DeviceConnectionSection and DeviceConnectionCards when devices are not connected', async () => {
    mockApiRequest(noDevicesConnectedState);

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
    expect(
      await connectedDevicesContainer.findByTestId('vendor-1-connect-link'),
    ).to.exist;
  });

  it('should render Vendor 1 in connected devices section when connected', async () => {
    mockApiRequest(oneDeviceConnectedState);

    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    const vendorKey = oneDeviceConnectedState.devices[0].key;

    expect(
      await connectedDevicesContainer.findByTestId(
        `${vendorKey}-disconnect-link`,
      ),
    ).to.exist;
  });

  it('should render "You do not have any devices connected" when no devices are connected', () => {
    mockApiRequest(noDevicesConnectedState);

    const noConnectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      noConnectedDevicesContainer.findByText(
        'You do not have any devices connected.',
      ),
    ).to.exist;
  });

  it('should render "You have connected all supported devices" when all supported devices are connected', () => {
    mockApiRequest(twoDevicesConnectedState);
    const twoDevicesConnectedContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      twoDevicesConnectedContainer.findByTestId('all-devices-connected-alert'),
    ).to.exist;
  });

  it('should render success alert when successAlert is set to true', () => {
    mockApiRequest(twoDevicesConnectedState);
    const initialState = {
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
    mockApiRequest(twoDevicesConnectedState);

    const initialState = {
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
});

describe('Device connection url parameters', () => {
  const successUrl = `${
    environment.BASE_URL
  }/health-care/connected-devices/?vendor-1=${CONNECTION_SUCCESSFUL_STATUS}#_=_`;
  const failureUrl = `${
    environment.BASE_URL
  }/health-care/connected-devices/?vendor-1=${CONNECTION_FAILED_STATUS}#_=_`;
  const successfulDisconnectUrl = `${
    environment.BASE_URL
  }/health-care/connected-devices/?vendor-1=${DISCONNECTION_SUCCESSFUL_STATUS}#_=_`;

  const failedDisconnectUrl = `${
    environment.BASE_URL
  }/health-care/connected-devices/?vendor-1=${DISCONNECTION_FAILED_STATUS}#_=_`;
  const savedLocation = window.location;

  beforeEach(() => {
    delete window.location;
  });
  afterEach(() => {
    window.location = savedLocation;
  });

  it('should render success alert when url params contain a success message', async () => {
    mockApiRequest(oneDeviceConnectedState);
    window.location = Object.assign(new URL(successUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(
      await connectedDevicesContainer.findByTestId('connection-success-alert'),
    ).to.exist;
  });

  it('should render failure alert when url params contain a error message', async () => {
    window.location = Object.assign(new URL(failureUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(
      await connectedDevicesContainer.findByTestId('connection-failure-alert'),
    ).to.exist;
  });
  it('should render successful disconnection alert when url params contain a disconnect success message', async () => {
    await mockApiRequest(oneDeviceConnectedState);
    window.location = Object.assign(new URL(successfulDisconnectUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const screen = renderInReduxProvider(<ConnectedDevicesContainer />);
    expect(screen.findByTestId('disconnection-success-alert')).to.exist;
  });
  it('should render failed disconnection alert when url params contain a disconnect failure message', async () => {
    await mockApiRequest(oneDeviceConnectedState);
    window.location = Object.assign(new URL(failedDisconnectUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const screen = renderInReduxProvider(<ConnectedDevicesContainer />);
    expect(await screen.findByTestId('disconnection-failure-alert')).to.exist;
  });
});
