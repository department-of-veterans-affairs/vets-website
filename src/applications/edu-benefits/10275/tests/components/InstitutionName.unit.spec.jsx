import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import InstitutionName from '../../components/InstitutionName';
import * as hook from '../../hooks/useValidateFacilityCode';

const mockStore = configureStore([]);

describe('InstitutionName Component', () => {
  let store;
  let apiRequestStub;
  let hookStub;

  const initialState = {
    form: {
      data: {
        institutionDetails: {
          facilityCode: '12345678',
        },
      },
    },
  };
  const injectVaTextInput = () => {
    const host = document.createElement('va-text-input');
    document.body.appendChild(host);
    return host;
  };
  beforeEach(() => {
    store = mockStore(initialState);
    apiRequestStub = sinon.stub(api, 'apiRequest');
  });

  afterEach(() => {
    apiRequestStub.restore();
    if (hookStub) hookStub.restore();
    hookStub = undefined;
    document.body.innerHTML = '';
    cleanup();
  });
  const makeStore = institutionName =>
    mockStore({
      form: {
        data: {
          institutionDetails: {
            facilityCode: '1234',
            institutionName,
          },
        },
      },
    });
  it('should fetch institution name and address, then update state on success', async () => {
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

    const { getByText, rerender } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    await new Promise(resolve => setImmediate(resolve));

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
    });
    expect(apiRequestStub.args[0][0]).to.equal('/gi/institutions/12345678');

    const actions = store.getActions();
    const setDataAction = actions.find(a => a.type === 'SET_DATA');
    expect(setDataAction, 'SET_DATA action was not dispatched').to.exist;

    const updatedStore = mockStore({
      form: {
        data: setDataAction.data,
      },
    });

    rerender(
      <Provider store={updatedStore}>
        <InstitutionName />
      </Provider>,
    );

    expect(getByText('Test Institution')).to.exist;

    expect(actions).to.deep.include(
      setData({
        ...initialState.form.data,
        institutionDetails: {
          ...initialState.form.data.institutionDetails,
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
        },
      }),
    );
  });

  it('should handle API error and set institution name to "not found" and address to empty object', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    await new Promise(resolve => setImmediate(resolve));

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
    });
    expect(getByText('--')).to.exist;
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).to.deep.include(
        setData({
          ...initialState.form.data,
          institutionDetails: {
            ...initialState.form.data.institutionDetails,
            institutionName: 'not found',
            institutionAddress: {},
          },
        }),
      );
    });
  });

  it('should not fetch institution name if facilityCode is invalid', () => {
    const invalidState = {
      form: {
        data: {
          institutionDetails: {
            facilityCode: '1234',
          },
        },
      },
    };
    store = mockStore(invalidState);

    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    expect(apiRequestStub.notCalled).to.be.true;
    expect(getByText('--')).to.exist;
  });
  it('sets aria-label to "Institution name not found" when institutionName === "not found"', () => {
    store = makeStore('not found');

    const { getByRole } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    // Accessible name comes from aria-label
    const heading = getByRole('heading', {
      level: 3,
      name: 'Institution name not found',
    });
    expect(heading).to.exist;
    // text is "--" in this case, which is fine; we care about the aria-label
  });

  it('sets aria-label to POE message when institutionName === "not valid"', () => {
    store = makeStore('not valid');

    const { getByRole } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    const heading = getByRole('heading', {
      level: 3,
      name: 'Institution name is not valid for Principles of Excellence',
    });
    expect(heading).to.exist;
  });

  it('sets aria-label to the institution name for a normal value', () => {
    store = makeStore('Test University');

    const { getByRole } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    const heading = getByRole('heading', {
      level: 3,
      name: 'Test University',
    });
    expect(heading).to.exist;
  });

  it('sets error message for "not found"', async () => {
    // force loader=false so the effect runs
    hookStub = sinon
      .stub(hook, 'useValidateFacilityCode')
      .returns({ loader: false });

    const host = injectVaTextInput();
    store = makeStore('not found');

    render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    await waitFor(() => {
      const attr = host.getAttribute('error') || '';
      expect(attr).to.contain('Please enter a valid 8-character facility code');
    });
  });

  it('sets POE error for "not valid"', async () => {
    hookStub = sinon
      .stub(hook, 'useValidateFacilityCode')
      .returns({ loader: false });

    const host = injectVaTextInput();
    store = makeStore('not valid');

    render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    await waitFor(() => {
      expect(host.getAttribute('error')).to.equal(
        'This institution is unable to participate in the Principles of Excellence.',
      );
    });
  });

  it('removes error when institutionName is a normal value', async () => {
    hookStub = sinon
      .stub(hook, 'useValidateFacilityCode')
      .returns({ loader: false });

    const host = injectVaTextInput();
    store = makeStore('Test University');

    render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    await waitFor(() => {
      expect(host.hasAttribute('error')).to.be.false;
    });
  });
});
