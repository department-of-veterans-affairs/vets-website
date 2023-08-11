import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { ConnectedDevicesContainer } from '../../components/ConnectedDevicesContainer';
import {
  CONNECTION_FAILED_STATUS,
  CONNECTION_SUCCESSFUL_STATUS,
  DISCONNECTION_FAILED_STATUS,
  DISCONNECTION_SUCCESSFUL_STATUS,
} from '../../constants/alerts';

const noDevicesConnectedResponse = {
  connectionAvailable: true,
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

const oneDeviceConnectedResponse = {
  connectionAvailable: true,
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

const twoDevicesConnectedResponse = {
  connectionAvailable: true,
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

const connectionUnavailableResponse = {
  connectionAvailable: false,
};

describe('Connect Devices Container When Connections Available', () => {
  it('should render DeviceConnectionSection and DeviceConnectionCards when devices are not connected', async () => {
    mockApiRequest(noDevicesConnectedResponse);

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
    mockApiRequest(oneDeviceConnectedResponse);

    const connectedDevicesContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    const vendorKey = oneDeviceConnectedResponse.devices[0].key;

    expect(
      await connectedDevicesContainer.findByTestId(
        `${vendorKey}-disconnect-link`,
      ),
    ).to.exist;
  });

  it('should render "You do not have any devices connected" when no devices are connected', () => {
    mockApiRequest(noDevicesConnectedResponse);

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
    mockApiRequest(twoDevicesConnectedResponse);
    const twoDevicesConnectedContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      twoDevicesConnectedContainer.findByTestId('all-devices-connected-alert'),
    ).to.exist;
  });

  it('should render success alert when successAlert is set to true', () => {
    mockApiRequest(twoDevicesConnectedResponse);
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
    mockApiRequest(twoDevicesConnectedResponse);

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

describe('Connect Devices Container When Connections Unavailable', () => {
  it('should render connection unavailable alert when device connection is unavailable', async () => {
    mockApiRequest(connectionUnavailableResponse);

    const connectionUnavailableContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      await connectionUnavailableContainer.findByTestId(
        'connection-unavailable-alert',
      ),
    ).to.exist;
  });

  it('should render connection unavailable alert when error response is returned', async () => {
    const err = {
      errors: [
        {
          title: 'Not authorized',
          detail: 'Not authorized',
          code: '401',
          status: '401',
        },
      ],
    };
    mockApiRequest(err, false);

    const connectionUnavailableContainer = renderInReduxProvider(
      <ConnectedDevicesContainer />,
    );

    expect(
      await connectionUnavailableContainer.findByTestId(
        'connection-unavailable-alert',
      ),
    ).to.exist;
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
    mockApiRequest(oneDeviceConnectedResponse);
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
    await mockApiRequest(oneDeviceConnectedResponse);
    window.location = Object.assign(new URL(successfulDisconnectUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const screen = renderInReduxProvider(<ConnectedDevicesContainer />);
    expect(screen.findByTestId('disconnection-success-alert')).to.exist;
  });
  it('should render failed disconnection alert when url params contain a disconnect failure message', async () => {
    await mockApiRequest(oneDeviceConnectedResponse);
    window.location = Object.assign(new URL(failedDisconnectUrl), {
      ancestorOrigins: '',
      assign: sinon.spy(),
    });
    const screen = renderInReduxProvider(<ConnectedDevicesContainer />);
    expect(await screen.findByTestId('disconnection-failure-alert')).to.exist;
  });
});
