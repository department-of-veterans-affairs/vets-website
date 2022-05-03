import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';
import environment from 'platform/utilities/environment';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { ConnectedDevicesContainer } from '../../components/ConnectedDevicesContainer';

// mockApiRequest(mockData);
const noDevicesConnectedState = [
  {
    vendor: 'vendor-1',
    key: 'vendor1',
    authUrl: 'path/to/vetsapi/vendor-1/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
    connected: false,
  },
  {
    vendor: 'vendor-2',
    key: 'vendor2',
    authUrl: 'path/to/vetsapi/vendor-2/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
    connected: false,
  },
];
const oneDeviceConnectedState = [
  {
    vendor: 'vendor-1',
    key: 'vendor1',
    authUrl: 'path/to/vetsapi/vendor-1/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
    connected: true,
  },
  {
    vendor: 'vendor-2',
    key: 'vendor2',
    authUrl: 'path/to/vetsapi/vendor-2/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
    connected: false,
  },
];

const twoDevicesConnectedState = [
  {
    vendor: 'vendor 1',
    key: 'vendor-1',
    authUrl: 'path/to/vetsapi/vendor-1/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
    connected: true,
  },
  {
    vendor: 'vendor 2',
    key: 'vendor-2',
    authUrl: 'path/to/vetsapi/vendor-2/connect/method',
    disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
    connected: true,
  },
];

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

  it('should render apple watch in connected devices section when connected', async () => {
    mockApiRequest(oneDeviceConnectedState);

    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(
      await connectedDevicesContainer.findByTestId('vendor-1-connect-link'),
    ).to.exist;
  });

  it('should render "You do not have any devices connected" when no devices are connected', () => {
    mockApiRequest(noDevicesConnectedState);

    const noConnectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      noConnectedDevicesContainer.findByText(
        'You do not have any devices connected',
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
    ).to.be.empty;
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
  }/health-care/connected-devices/?vendor1=success#_=_`;
  const failureUrl = `${
    environment.BASE_URL
  }/health-care/connected-devices/?vendor1=error#_=_`;
  const savedLocation = window.location;

  beforeEach(() => {
    delete window.location;
  });
  afterEach(() => {
    window.location = savedLocation;
  });

  it('should render success alert when url params contain a success message', async () => {
    window.location = Object.assign(new URL(successUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(await connectedDevicesContainer.findByTestId('success-alert')).to
      .exist;
  });

  it('should render failure alert when url params contain a error message', async () => {
    window.location = Object.assign(new URL(failureUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );
    expect(await connectedDevicesContainer.findByTestId('failure-alert')).to
      .exist;
  });
});
