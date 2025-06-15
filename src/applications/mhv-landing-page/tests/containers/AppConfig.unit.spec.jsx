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
    CSP = 'idme',
    LOA = 3,
    isVAPatient = true,
  } = {}) => ({
    user: {
      profile: {
        accountUuid,
        facilities,
        signIn: {
          serviceName: CSP,
        },
        loa: {
          current: LOA,
        },
        vaPatient: isVAPatient,
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
            CSP: 'idme',
            LOA: 3,
            isVAPatient: true,
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
            CSP: 'idme',
            LOA: 3,
            isVAPatient: true,
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
            CSP: 'idme',
            LOA: 3,
            isVAPatient: true,
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
            CSP: 'idme',
            LOA: 3,
            isVAPatient: true,
          }),
        ).to.be.true;
      });
    });

    it('sets the CSP based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        CSP: 'dslogon',
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
            hasVista: false,
            CSP: 'dslogon',
            LOA: 3,
            isVAPatient: true,
          }),
        ).to.be.true;
      });
    });

    it('sets the CSP to empty string if profile is not available', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        CSP: '',
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
            hasVista: false,
            CSP: '',
            LOA: 3,
            isVAPatient: true,
          }),
        ).to.be.true;
      });
    });

    it('sets the LOA based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        LOA: 1,
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
            hasVista: false,
            CSP: 'idme',
            LOA: 1,
            isVAPatient: true,
          }),
        ).to.be.true;
      });
    });

    it('sets the LOA to null if profile is not available', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        LOA: null,
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
            hasVista: false,
            CSP: 'idme',
            LOA: null,
            isVAPatient: true,
          }),
        ).to.be.true;
      });
    });
    it('sets the isVAPatient based on profile', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        isVAPatient: false,
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
            hasVista: false,
            CSP: 'idme',
            LOA: 3,
            isVAPatient: false,
          }),
        ).to.be.true;
      });
    });

    it('set isVAPatient to false if profile is not available', async () => {
      const initialState = initialStateFn({
        accountUuid: 'test-id',
        facilities: [],
        isVAPatient: null,
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
            hasVista: false,
            CSP: 'idme',
            LOA: 3,
            isVAPatient: null,
          }),
        ).to.be.true;
      });
    });
  });
});
