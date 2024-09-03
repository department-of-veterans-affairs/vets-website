import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';

import AppConfig from '../../containers/AppConfig';
import { appName } from '../../manifest.json';

describe(`${appName} -- <AppConfig />`, () => {
  describe('calls datadogRum.setUser', () => {
    const initialStateFn = ({ accountUuid = 'test-id' } = {}) => ({
      user: {
        profile: {
          accountUuid,
        },
      },
    });

    let setRumUserSpy;
    beforeEach(() => {
      setRumUserSpy = sinon.spy(datadogRum, 'setUser');
    });

    afterEach(() => {
      setRumUserSpy.restore();
    });

    it('when a user id is available', async () => {
      const initialState = initialStateFn();

      const { getByText } = renderWithStoreAndRouter(
        <AppConfig>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );
      waitFor(() => {
        getByText('child node');
        expect(setRumUserSpy.calledWith({ id: 'test-id' })).to.be.true;
      });
    });

    it('when user id is not available', async () => {
      const initialState = initialStateFn({ accountUuid: '' });

      const { getByText } = renderWithStoreAndRouter(
        <AppConfig>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(setRumUserSpy.called).to.be.false;
      });
    });
  });
});
