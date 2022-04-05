import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import chai, { expect } from 'chai';
import environment from 'platform/utilities/environment';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { DevicesToConnectSection } from '../../components/DevicesToConnectSection';

describe('Devices To Connect Section', () => {
  it('should call correct url', () => {
    chai.use(sinonChai);
    const authorizeDevice = sinon.spy();
    const device = {
      vendor: 'Fitbit',
      authUrl: `${environment.API_URL}/dhp_connected_devices/fitbit`,
      disconnectUrl: 'placeholder',
      connected: false,
    };
    const { getByTestId } = render(
      <DevicesToConnectSection
        connectedDevices={[device]}
        onClickHandler={authorizeDevice}
        data-testId="devices-to-connect-section"
      />,
    );
    fireEvent.click(getByTestId('Fitbit-connect-link'));
    expect(authorizeDevice).to.have.been.calledWith(device);
  });
});
