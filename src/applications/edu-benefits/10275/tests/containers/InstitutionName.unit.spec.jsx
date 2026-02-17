import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import InstitutionName from '../../containers/InstitutionName';

const mockStore = configureStore([]);

describe('InstitutionName Component', () => {
  let store;
  let apiRequestStub;

  const initialState = {
    form: {
      data: {
        institutionDetails: {
          facilityCode: '12345678',
        },
      },
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    apiRequestStub = sinon.stub(api, 'apiRequest');
  });

  afterEach(() => {
    apiRequestStub.restore();
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

  it('fetches institution data and dispatches SET_DATA on success', async () => {
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

    const { findByText, rerender } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiRequestStub.calledOnce).to.be.true;
      expect(apiRequestStub.firstCall.args[0]).to.equal(
        '/gi/institutions/12345678',
      );
    });

    const actions = store.getActions();
    const setDataAction = actions.find(a => a.type === setData().type);
    expect(setDataAction, 'SET_DATA action was not dispatched').to.exist;

    const updatedStore = mockStore({ form: { data: setDataAction.data } });

    rerender(
      <Provider store={updatedStore}>
        <InstitutionName />
      </Provider>,
    );

    // assert the name renders after re-render
    expect(await findByText('Test Institution')).to.exist;

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
          poeEligible: true,
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
      const setDataAction = actions.find(a => a.type === setData().type);
      expect(setDataAction, 'expected SET_DATA action').to.exist;

      const { institutionDetails } = setDataAction.data;
      expect(institutionDetails.facilityCode).to.equal('12345678');
      expect(institutionDetails.institutionName).to.equal('not found');
      expect(institutionDetails.institutionAddress).to.deep.equal({});
    });
  });

  it('does not fetch when facilityCode length is not 8', () => {
    const invalidState = {
      form: {
        data: {
          institutionDetails: { facilityCode: '1234' },
        },
      },
    };
    store = mockStore(invalidState);

    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    expect(apiRequestStub.called).to.be.false;
    expect(getByText('--')).to.exist;
  });

  it('sets aria-label to "Institution name not found" when institutionName === "not found"', () => {
    store = makeStore('not found');

    const { getByRole } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    const heading = getByRole('heading', {
      level: 3,
      name: 'Institution name not found',
    });
    expect(heading).to.exist;
  });

  it('sets aria-label to the institution name when present', () => {
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
});
