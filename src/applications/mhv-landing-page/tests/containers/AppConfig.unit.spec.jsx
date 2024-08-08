import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';

import AppConfig from '../../containers/AppConfig';
import { appName } from '../../manifest.json';

const initialStateFn = ({ accountUuid = 'test-id' } = {}) => ({
  user: {
    profile: {
      accountUuid,
    },
  },
});

describe(`${appName} -- <AppConfig />`, () => {
  it('initializes datadog RUM', () => {
    const useRumSpy = sinon.spy(datadogRum, 'init');

    const initialState = initialStateFn();

    const { getByText } = renderWithStoreAndRouter(
      <AppConfig>
        <p>child node</p>
      </AppConfig>,
      { initialState },
    );

    waitFor(() => {
      getByText('child node');

      // Check that datadogRum methods are called
      expect(useRumSpy.called).to.be.true;
    });

    useRumSpy.restore();
  });

  it('calls datadogRum.setUser when a user id is available', () => {
    const setRumUserSpy = sinon.spy(datadogRum, 'setUser');
    const initialState = initialStateFn();

    const { getByText } = renderWithStoreAndRouter(
      <AppConfig>
        <p>child node</p>
      </AppConfig>,
      { initialState },
    );

    waitFor(() => {
      getByText('child node');
      // Check that datadogRum methods are called
      expect(setRumUserSpy.calledWith({ id: 'test-id' })).to.be.true;
    });

    setRumUserSpy.restore();
  });

  it('does not call datadogRum.setUser when user id is not available', () => {
    const setRumUserSpy = sinon.spy(datadogRum, 'setUser');
    const initialState = initialStateFn({ accountUuid: '' });

    const { getByText } = renderWithStoreAndRouter(
      <AppConfig>
        <p>child node</p>
      </AppConfig>,
      { initialState },
    );

    waitFor(() => {
      getByText('child node');
      expect(setRumUserSpy.called).to.be.false;
    });

    setRumUserSpy.restore();
  });
});
