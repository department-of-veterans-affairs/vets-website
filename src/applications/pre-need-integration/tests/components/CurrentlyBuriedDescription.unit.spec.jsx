import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import CurrentlyBuriedDescription from '../../components/CurrentlyBuriedDescription';
import * as helpers from '../../utils/helpers';

const mockStore = configureStore();

describe('CurrentlyBuriedDescription Component', () => {
  let store;
  let isVeteranStub;
  let isAuthorizedAgentStub;

  const renderComponent = state => {
    store = mockStore(state);
    return mount(
      <Provider store={store}>
        <CurrentlyBuriedDescription />
      </Provider>,
    );
  };

  beforeEach(() => {
    isVeteranStub = sinon.stub(helpers, 'isVeteran');
    isAuthorizedAgentStub = sinon.stub(helpers, 'isAuthorizedAgent');
  });

  afterEach(() => {
    isVeteranStub.restore();
    isAuthorizedAgentStub.restore();
  });

  it('should return text for veteran without authorized agent', () => {
    isVeteranStub.returns(true);
    isAuthorizedAgentStub.returns(false);

    const wrapper = renderComponent({
      form: {
        data: {},
      },
    });

    expect(wrapper.text()).to.equal(
      'Provide the details of the person(s) currently buried in a VA national cemetery under your eligibility.',
    );
  });

  it('should return text for veteran with authorized agent', () => {
    isVeteranStub.returns(true);
    isAuthorizedAgentStub.returns(true);

    const wrapper = renderComponent({
      form: {
        data: {},
      },
    });

    expect(wrapper.text()).to.equal(
      'Provide the details of the person(s) currently buried in a VA national cemetery under the applicant’s eligibility.',
    );
  });

  it('should return text for non-veteran', () => {
    isVeteranStub.returns(false);
    isAuthorizedAgentStub.returns(false);

    const wrapper = renderComponent({
      form: {
        data: {},
      },
    });

    expect(wrapper.text()).to.equal(
      'Provide the details of the person(s) currently buried in a VA national cemetery under the sponsor’s eligibility.',
    );
  });
});
