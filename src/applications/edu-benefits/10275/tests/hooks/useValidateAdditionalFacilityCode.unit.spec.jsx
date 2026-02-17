import React from 'react';
import { render, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import { useValidateAdditionalFacilityCode } from '../../hooks/useValidateAdditionalFacilityCode';

const mockStore = configureStore([]);

const TestHook = ({ formData, index }) => {
  const {
    loader,
    institutionName,
    institutionAddress,
  } = useValidateAdditionalFacilityCode(formData, index);
  return (
    <div>
      <div data-testid="loader">{loader ? 'loading' : 'idle'}</div>
      <div data-testid="institution-name">{institutionName}</div>
      <div data-testid="institution-address">
        {JSON.stringify(institutionAddress)}
      </div>
    </div>
  );
};

describe('useValidateAdditionalFacilityCode', () => {
  let store;
  let apiRequestStub;

  const baseFormData = (facilityCode, overrides = {}) => ({
    additionalLocations: [
      {
        facilityCode,
        ...overrides,
      },
    ],
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

  it('should NOT call API when facilityCode length is not 8', async () => {
    const formData = baseFormData('1234');

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    expect(getByTestId('loader').textContent).to.equal('idle');
    expect(getByTestId('institution-name').textContent).to.equal('not found');

    await waitFor(() => {
      expect(apiRequestStub.called).to.equal(false);
      expect(store.getActions()).to.deep.equal([]);
    });
  });

  it('should NOT call API when index is undefined', async () => {
    const formData = baseFormData('12345678');

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} index={undefined} />
      </Provider>,
    );

    expect(getByTestId('loader').textContent).to.equal('idle');

    await waitFor(() => {
      expect(apiRequestStub.called).to.equal(false);
      expect(store.getActions()).to.deep.equal([]);
    });
  });

  it('calls API when facilityCode length is 8 and dispatches eligible data', async () => {
    const formData = baseFormData('12345678');

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
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        '/gi/institutions/12345678',
      );
      expect(apiRequestStub.firstCall.args[1]).to.deep.equal({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    await waitFor(() => {
      expect(getByTestId('loader').textContent).to.equal('idle');
      expect(getByTestId('institution-name').textContent).to.equal(
        'Test Institution',
      );
    });

    const actions = store.getActions();
    const setDataActions = actions.filter(a => a.type === setData().type);
    const finalAction = setDataActions.find(
      action =>
        action.data.additionalLocations &&
        action.data.additionalLocations[0] &&
        action.data.additionalLocations[0].isLoading === false,
    );

    expect(finalAction, 'expected SET_DATA action').to.exist;
    expect(finalAction.data.additionalLocations[0]).to.deep.equal({
      facilityCode: '12345678',
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
      isLoading: false,
    });
  });
  it('dispatches poeEligible true when programTypes includes NCD', async () => {
    const formData = baseFormData('12345678');
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
          programTypes: ['NCD'],
        },
      },
    });

    render(
      <Provider store={store}>
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
    });

    const actions = store.getActions();
    const finalAction = actions.find(
      action =>
        action.data.additionalLocations &&
        action.data.additionalLocations[0] &&
        action.data.additionalLocations[0].isLoading === false,
    );
    expect(finalAction).to.exist;
    expect(finalAction.data.additionalLocations[0].poeEligible).to.equal(true);
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
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
    });

    await waitFor(() => {
      const actions = store.getActions();
      const finalAction = actions.find(
        action =>
          action.data.additionalLocations &&
          action.data.additionalLocations[0] &&
          action.data.additionalLocations[0].isLoading === false,
      );
      expect(finalAction).to.exist;
      expect(finalAction.data.additionalLocations[0].poeEligible).to.equal(
        false,
      );
    });
  });

  it('dispatches "not found" on API error', async () => {
    const formData = baseFormData('12345678');
    apiRequestStub.rejects(new Error('boom'));

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
    });

    await waitFor(() => {
      expect(getByTestId('loader').textContent).to.equal('idle');
      expect(getByTestId('institution-name').textContent).to.equal('not found');
    });

    const actions = store.getActions();
    const finalAction = actions.find(
      action =>
        action.data.additionalLocations &&
        action.data.additionalLocations[0] &&
        action.data.additionalLocations[0].isLoading === false,
    );
    expect(finalAction).to.exist;
    expect(finalAction.data.additionalLocations[0].institutionName).to.equal(
      'not found',
    );
    expect(
      finalAction.data.additionalLocations[0].institutionAddress,
    ).to.deep.equal({});
    expect(finalAction.data.additionalLocations[0].poeEligible).to.be.null;
  });

  it('sets loader true during fetch and false after completion', async () => {
    const formData = baseFormData('12345678');

    let resolveFn;
    const pending = new Promise(resolve => {
      resolveFn = resolve;
    });
    apiRequestStub.returns(pending);

    const { getByTestId } = render(
      <Provider store={store}>
        <TestHook formData={formData} index={0} />
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

  it('sets isLoading true in formData during fetch', async () => {
    const formData = baseFormData('12345678');

    let resolveFn;
    const pending = new Promise(resolve => {
      resolveFn = resolve;
    });
    apiRequestStub.returns(pending);

    render(
      <Provider store={store}>
        <TestHook formData={formData} index={0} />
      </Provider>,
    );

    await waitFor(() => {
      const actions = store.getActions();
      const loadingAction = actions.find(
        action =>
          action.data.additionalLocations &&
          action.data.additionalLocations[0] &&
          action.data.additionalLocations[0].isLoading === true,
      );
      expect(loadingAction).to.exist;
    });

    resolveFn({
      data: {
        attributes: {
          name: 'Test Institution',
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
      const actions = store.getActions();
      const finalAction = actions.find(
        action =>
          action.data.additionalLocations &&
          action.data.additionalLocations[0] &&
          action.data.additionalLocations[0].isLoading === false,
      );
      expect(finalAction).to.exist;
    });
  });

  it('updates form data at correct index on successful fetch', async () => {
    const formData = {
      additionalLocations: [
        {
          facilityCode: '11111111',
        },
        {
          facilityCode: '12345678',
        },
        {
          facilityCode: '33333333',
        },
      ],
    };

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

    render(
      <Provider store={store}>
        <TestHook formData={formData} index={1} />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.equal(true);
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        '/gi/institutions/12345678',
      );
    });

    await waitFor(() => {
      const actions = store.getActions();
      const finalAction = actions.find(
        action =>
          action.data.additionalLocations &&
          action.data.additionalLocations[1] &&
          action.data.additionalLocations[1].isLoading === false &&
          action.data.additionalLocations[1].institutionName ===
            'Test Institution',
      );
      expect(finalAction).to.exist;
      expect(
        finalAction.data.additionalLocations[1].institutionAddress,
      ).to.deep.equal({
        street: '123 Main St',
        street2: 'Suite 100',
        street3: 'Building A',
        city: 'Anytown',
        state: 'VA',
        postalCode: '12345',
        country: 'USA',
      });

      expect(finalAction.data.additionalLocations[0].facilityCode).to.equal(
        '11111111',
      );
      expect(finalAction.data.additionalLocations[2].facilityCode).to.equal(
        '33333333',
      );
    });
  });
});
