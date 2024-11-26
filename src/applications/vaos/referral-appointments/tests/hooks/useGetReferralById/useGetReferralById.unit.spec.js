import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { getPatientReferralById } from '../../../../services/referral';

import TestComponent from './TestComponent';

describe('Community Care Referrals', () => {
  describe('useGerReferralById hook', () => {
    const sandbox = sinon.createSandbox();
    let store;
    const api = { fetchReferral: getPatientReferralById };
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        featureToggles: {
          vaOnlineSchedulingCCDirectScheduling: true,
        },
        referral: {
          facility: null,
          referrals: [],
          referralFetchStatus: 'notStarted',
        },
      };
      store = mockStore(initState);
      sandbox.stub(api, 'fetchReferral').resolves({});
    });
    afterEach(() => {
      sandbox.restore();
    });
    it.skip('Loads test component with hook', () => {
      const screen = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
      );
      expect(screen.getByText(/TestComponent/i)).to.exist;
      sandbox.assert.calledOnce(api.fetchReferral);
    });
  });
});
