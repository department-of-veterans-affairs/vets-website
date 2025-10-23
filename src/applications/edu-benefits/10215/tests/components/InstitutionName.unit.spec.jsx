import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import InstitutionName from '../../components/InstitutionName';

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
  });

  it('should fetch institution name and update state on success', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test Institution',
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    await new Promise(resolve => setImmediate(resolve));

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.args[0][0]).to.equal('/gi/institutions/12345678');
    expect(getByText('Test Institution')).to.exist;

    const actions = store.getActions();
    expect(actions).to.deep.include(
      setData({
        ...initialState.form.data,
        institutionDetails: {
          ...initialState.form.data.institutionDetails,
          institutionName: 'Test Institution',
        },
      }),
    );
    apiRequestStub.restore();
  });

  it('should handle API error and set institution name to "not found"', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    const { getByText } = render(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    await new Promise(resolve => setImmediate(resolve));

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(getByText('--')).to.to.exist;

    const actions = store.getActions();
    expect(actions).to.deep.include(
      setData({
        ...initialState.form.data,
        institutionDetails: {
          ...initialState.form.data.institutionDetails,
          institutionName: 'not found',
        },
      }),
    );
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
});
