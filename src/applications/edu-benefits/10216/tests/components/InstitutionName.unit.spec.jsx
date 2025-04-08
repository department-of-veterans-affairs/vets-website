import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { setData } from 'platform/forms-system/src/js/actions';
import InstitutionName from '../../components/InstitutionName';

const mockStore = configureStore([]);

describe('InstitutionName Component', () => {
  let store;
  let wrapper;
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

  it('should fetch institution name and update state on success', async () => {
    const mockResponse = {
      data: {
        attributes: {
          name: 'Test Institution',
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    wrapper = mount(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.args[0][0]).to.equal('/gi/institutions/12345678');
    expect(wrapper.find('p.vads-u-font-weight--bold').text()).to.equal(
      'Test Institution',
    );

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
    wrapper.unmount();
    apiRequestStub.restore();
  });

  it('should handle API error and set institution name to "not found"', async () => {
    apiRequestStub.rejects(new Error('API Error'));

    wrapper = mount(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );
    await new Promise(resolve => setImmediate(resolve));
    wrapper.update();

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(wrapper.find('p.vads-u-font-weight--bold').text()).to.equal('--');

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
    wrapper.unmount();
    apiRequestStub.restore();
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
    wrapper = mount(
      <Provider store={store}>
        <InstitutionName />
      </Provider>,
    );

    expect(apiRequestStub.notCalled).to.be.true;
    expect(wrapper.find('p.vads-u-font-weight--bold').text()).to.equal('--');
    wrapper.unmount();
  });
});
