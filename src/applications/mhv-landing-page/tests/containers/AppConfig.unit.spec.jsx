import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  setDatadogRumUser,
  useDatadogRum,
} from '@department-of-veterans-affairs/mhv/exports';
import sinon from 'sinon';
import { expect } from 'chai';

import AppConfig from '../../containers/AppConfig';
import { appName } from '../../manifest.json';

describe(`${appName} -- <AppConfig />`, () => {
  const initialStateFn = ({
    accountUuid = 'test-id',
    facilities = [],
  } = {}) => ({
    user: {
      profile: {
        accountUuid,
        facilities,
      },
    },
  });

  it('initializes datadog RUM', () => {
    const useRumSpy = sinon.spy(useDatadogRum);
    const initialState = initialStateFn();

    const { getByText } = renderWithStoreAndRouter(
      <AppConfig useDatadogRumFn={useRumSpy}>
        <p>child node</p>
      </AppConfig>,
      { initialState },
    );

    getByText('child node');
    expect(useRumSpy.called).to.be.true;
  });

  describe('calls datadogRum.setUser', () => {
    let setRumUserSpy;
    beforeEach(() => {
      setRumUserSpy = sinon.spy(setDatadogRumUser);
    });

    it('when a user id is available', async () => {
      const initialState = initialStateFn();

      const { getByText } = renderWithStoreAndRouter(
        <AppConfig setDatadogRumUserFn={setRumUserSpy}>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(
          setRumUserSpy.calledWith({
            id: 'test-id',
            hasEHRM: false,
            hasVista: false,
          }),
        ).to.be.true;
      });
    });

    it('unless user id is not available', async () => {
      const initialState = initialStateFn({ accountUuid: '' });

      const { getByText } = renderWithStoreAndRouter(
        <AppConfig setDatadogRumUserFn={setRumUserSpy}>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(setRumUserSpy.called).to.be.false;
      });
    });

    it('sets hasVista based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [{ isCerner: false }],
      });
      const { getByText } = renderWithStoreAndRouter(
        <AppConfig setDatadogRumUserFn={setRumUserSpy}>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(
          setRumUserSpy.calledWith({
            id: 'test-id',
            hasEHRM: false,
            hasVista: true,
          }),
        ).to.be.true;
      });
    });

    it('sets hasEHRM based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [{ isCerner: true }],
      });
      const { getByText } = renderWithStoreAndRouter(
        <AppConfig setDatadogRumUserFn={setRumUserSpy}>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(
          setRumUserSpy.calledWith({
            id: 'test-id',
            hasEHRM: true,
            hasVista: false,
          }),
        ).to.be.true;
      });
    });

    it('sets both hasEHRM and hasVista based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [{ isCerner: true }, { isCerner: false }],
      });
      const { getByText } = renderWithStoreAndRouter(
        <AppConfig setDatadogRumUserFn={setRumUserSpy}>
          <p>child node</p>
        </AppConfig>,
        { initialState },
      );

      await waitFor(() => {
        getByText('child node');
        expect(
          setRumUserSpy.calledWith({
            id: 'test-id',
            hasEHRM: true,
            hasVista: true,
          }),
        ).to.be.true;
      });
    });
  });
});
