import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import { useValidateFacilityCode } from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

const TestHook = ({ formData }) => {
  const { loader } = useValidateFacilityCode(formData);
  return <div data-testid="loader">{loader ? 'loading' : 'idle'}</div>;
};

describe('useValidateFacilityCode', () => {
  let store;
  let apiRequestStub;

  const baseFormData = (facilityCode, overrides = {}) => ({
    institutionDetails: {
      facilityCode,
      ...overrides,
    },
  });

  beforeEach(() => {
    store = mockStore({});
    apiRequestStub = sinon.stub(api, 'apiRequest');
  });

  afterEach(() => {
    cleanup();
    apiRequestStub.restore();
    store.clearActions();
  });

  it('does NOT call API when facilityCode length is not 8', async () => {
    const formData = baseFormData('1234');

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} />
      </Provider>,
    );

    expect(getByTestId('loader').textContent).to.equal('idle');

    await waitFor(() => {
      expect(apiRequestStub.called).to.equal(false);
      expect(store.getActions()).to.deep.equal([]);
    });
  });

  it('calls API when facilityCode length is 8 and dispatches eligible data', async () => {
    const formData = baseFormData(' 12345678 ');

    const mockResponse = {
      data: {
        attributes: {
          name: 'Test Institution',
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: 'Building A',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
          programTypes: ['IHL'],
        },
      },
    };
    apiRequestStub.resolves(mockResponse);

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        '/gi/institutions/12345678',
      );
    });

    await waitFor(() => {
      expect(getByTestId('loader').textContent).to.equal('idle');
    });

    const actions = store.getActions();
    const setDataAction = actions.find(a => a.type === setData().type);
    expect(setDataAction, 'expected SET_DATA action').to.exist;
    expect(setDataAction.data.institutionDetails).to.deep.equal({
      facilityCode: ' 12345678 ',
      institutionName: 'Test Institution',
      institutionAddress: {
        street: '123 Main St',
        street2: 'Suite 100',
        street3: 'Building A',
        city: 'Anytown',
        state: 'VA',
        postalCode: '12345',
        country: 'USA',
      },
      poeEligible: true,
    });
  });

  it('dispatches poeEligible false when facilityCode is not POE eligible', async () => {
    const formData = baseFormData('41123456');
    apiRequestStub.resolves({
      data: {
        attributes: {
          name: 'Test Institution',
          address1: '123 Main St',
          address2: 'Suite 100',
          address3: 'Building A',
          city: 'Anytown',
          state: 'VA',
          zip: '12345',
          country: 'USA',
          programTypes: ['IHL'],
        },
      },
    });

    render(
      <Provider store={store}>
        <TestHook formData={formData} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
    });

    await waitFor(() => {
      const setDataAction = store
        .getActions()
        .find(a => a.type === setData().type);
      expect(setDataAction).to.exist;
      expect(setDataAction.data.institutionDetails.poeEligible).to.equal(false);
      expect(setDataAction.data.institutionDetails).to.deep.equal({
        facilityCode: '41123456',
        institutionName: 'Test Institution',
        institutionAddress: {
          street: '123 Main St',
          street2: 'Suite 100',
          street3: 'Building A',
          city: 'Anytown',
          state: 'VA',
          postalCode: '12345',
          country: 'USA',
        },
        poeEligible: false,
      });
    });
  });

  it('dispatches "not found" on API error', async () => {
    const formData = baseFormData('12345678');
    apiRequestStub.rejects(new Error('boom'));

    render(
      <Provider store={store}>
        <TestHook formData={formData} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
    });

    const setDataAction = store
      .getActions()
      .find(a => a.type === setData().type);
    expect(setDataAction).to.exist;
    expect(setDataAction.data.institutionDetails.institutionName).to.equal(
      'not found',
    );
    expect(
      setDataAction.data.institutionDetails.institutionAddress,
    ).to.deep.equal({});
  });

  it('sets loader true during fetch and false after completion', async () => {
    const formData = baseFormData('12345678');

    // control the promise to assert loader flip
    let resolveFn;
    const pending = new Promise(resolve => {
      resolveFn = resolve;
    });
    apiRequestStub.returns(pending);

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} />
      </Provider>,
    );

    await waitFor(() => {
      expect(getByTestId('loader').textContent).to.equal('loading');
    });

    resolveFn({
      data: {
        attributes: {
          name: 'X',
          programTypes: ['IHL'],
          address1: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
      },
    });

    await waitFor(() => {
      expect(getByTestId('loader').textContent).to.equal('idle');
    });
  });
});
