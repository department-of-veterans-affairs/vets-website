import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import TransitionSuccessModal from 'platform/user/authentication/components/account-transition/TransitionSuccessModal';

const mockStore = configureMockStore();

describe('', () => {
  let wrapper;
  let store;
  const props = { visible: false, onClose: sinon.spy() };

  beforeEach(() => {
    store = mockStore({
      user: {
        profile: {
          signIn: {
            serviceName: 'mhv',
          },
        },
      },
    });
    wrapper = mount(
      <Provider store={store}>
        <TransitionSuccessModal {...props} />
      </Provider>,
    );
  });

  afterEach(() => {
    store = {};
  });

  it('should display when `visible` is set to true', () => {
    expect(wrapper.find('TransitionSuccessModal').prop('visible')).to.be.false;
    wrapper.children().props().visible = true;
    expect(wrapper.find('TransitionSuccessModal').prop('visible')).to.be.true;
    wrapper.unmount();
  });

  it('should include `Account transfer is complete` in the modal', () => {
    expect(wrapper.find('Modal').props().title).to.include(
      'Account transfer is complete',
    );
    wrapper.unmount();
  });

  it('should close the modal when primaryButton action is called', () => {
    const { action: continueToVA } = wrapper
      .find('Modal')
      .prop('primaryButton');

    continueToVA();
    expect(wrapper.find('TransitionSuccessModal').prop('onClose').calledOnce).to
      .be.true;
    wrapper.unmount();
  });
});
