import React from 'react';
import { expect } from 'chai';
import { render, waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import { useVaFacilityCode } from '../../hooks/useVaFacilityCode';

const mockStore = configureStore([thunk]);

// Simple component that just invokes the hook
const TestHost = () => {
  useVaFacilityCode();
  return <div data-testid="host" />;
};

describe('useVaFacilityCode', () => {
  let store;
  let apiStub;

  const baseState = facilityCode => ({
    form: {
      data: {
        institutionDetails: {
          facilityCode,
          // ensure these are preserved/merged
          someOtherField: 'keep-me',
        },
      },
    },
  });

  beforeEach(() => {
    store = mockStore(baseState(''));
    apiStub = sinon.stub(api, 'apiRequest');
  });

  afterEach(() => {
    cleanup();
    apiStub.restore();
    store.clearActions();
  });

  it('does NOT call API when facilityCode length is not 8', async () => {
    store = mockStore(baseState('1234'));

    render(
      <Provider store={store}>
        <TestHost />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.called).to.equal(false);
      // No setData actions dispatched
      const actions = store.getActions();
      const setDataActions = actions.filter(a => a.type === setData().type);
      expect(setDataActions.length).to.equal(0);
    });
  });

  it('calls API when facilityCode length is 8 and dispatches loader → success payload', async () => {
    store = mockStore(baseState('12345678'));

    const mockResponse = {
      data: {
        attributes: {
          name: 'Test Institution',
          address1: '123 Main',
          address2: 'Suite 100',
          address3: 'Bldg A',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
        },
      },
    };
    apiStub.resolves(mockResponse);

    render(
      <Provider store={store}>
        <TestHost />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.calledOnce).to.equal(true);
      expect(apiStub.firstCall.args[0]).to.equal('/gi/institutions/12345678');
    });

    const actions = store.getActions();
    const setDataActions = actions.filter(a => a.type === setData().type);

    // Expect two setData dispatches: loader=true seed, then success payload
    expect(setDataActions.length).to.equal(2);

    const first = setDataActions[0].data.institutionDetails;
    expect(first).to.include({
      institutionName: '',
      loader: true,
    });

    const second = setDataActions[1].data.institutionDetails;
    expect(second).to.deep.equal({
      facilityCode: '12345678',
      someOtherField: 'keep-me', // preserved by spread
      institutionName: 'Test Institution',
      institutionAddress: {
        street: '123 Main',
        street2: 'Suite 100',
        street3: 'Bldg A',
        city: 'Anytown',
        state: 'VA',
        postalCode: '12345',
        country: 'USA',
      },
      loader: false,
    });
  });

  it('dispatches "not found" payload on API error and sets loader false', async () => {
    store = mockStore(baseState('12345678'));
    apiStub.rejects(new Error('boom'));

    render(
      <Provider store={store}>
        <TestHost />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.calledOnce).to.equal(true);
    });

    const actions = store.getActions();
    const setDataActions = actions.filter(a => a.type === setData().type);
    expect(setDataActions.length).to.equal(2);

    const first = setDataActions[0].data.institutionDetails;
    expect(first.loader).to.equal(true);

    const second = setDataActions[1].data.institutionDetails;
    expect(second).to.deep.equal({
      facilityCode: '12345678',
      someOtherField: 'keep-me',
      institutionName: 'not found',
      institutionAddress: {
        street: '',
        street2: '',
        street3: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      loader: false,
    });
  });
  it('handles response with no `data` property (triggers `response?.data || {}` fallback)', async () => {
    store = mockStore({
      form: {
        data: {
          institutionDetails: {
            facilityCode: '12345678',
            someOtherField: 'keep-me',
          },
        },
      },
    });

    // Resolve with NO `data` key at all -> response?.data === undefined -> falls back to {}
    apiStub.resolves({});

    render(
      <Provider store={store}>
        <TestHost />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.calledOnce).to.equal(true);
      expect(apiStub.firstCall.args[0]).to.equal('/gi/institutions/12345678');
    });

    const actions = store.getActions();
    const setDataActions = actions.filter(a => a.type === setData().type);

    // Expect loader seed + "success" mapping with undefined attributes
    expect(setDataActions.length).to.equal(2);

    // First action: loader on
    expect(setDataActions[0].data.institutionDetails).to.include({
      institutionName: '',
      loader: true,
    });

    // Second action: attributes are undefined → all mapped fields undefined, loader off
    expect(setDataActions[1].data.institutionDetails).to.deep.equal({
      facilityCode: '12345678',
      someOtherField: 'keep-me',
      institutionName: undefined,
      institutionAddress: {
        street: '',
        street2: '',
        street3: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      loader: false,
    });
  });
});
