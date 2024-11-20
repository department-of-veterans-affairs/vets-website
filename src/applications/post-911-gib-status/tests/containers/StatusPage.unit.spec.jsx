import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import StatusPage from '../../containers/StatusPage';

const mockStore = configureStore([]);
const initialState = {
  post911GIBStatus: {
    enrollmentData: {
      veteranIsEligible: true,
      dateOfBirth: '1995-11-12T06:00:00.000+0000',
      remainingEntitlement: {},
      originalEntitlement: {},
      usedEntitlement: {},
    },
  },
};

describe('<StatusPage>', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('should render the StatusPage component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <StatusPage />
      </Provider>,
    );
    expect(wrapper.find(StatusPage).exists()).to.be.true;
    wrapper.unmount();
  });

  it('should display the title and the print button when eligible', () => {
    const wrapper = mount(
      <Provider store={store}>
        <StatusPage />
      </Provider>,
    );

    expect(wrapper.find('h1').text()).to.equal(
      'Your Post-9/11 GI Bill Statement of Benefits',
    );
    expect(wrapper.find('#print-button').exists()).to.be.true;

    wrapper.unmount();
  });

  it('should not show the intro text or print button if veteran is not eligible', () => {
    const state = {
      post911GIBStatus: {
        enrollmentData: {
          veteranIsEligible: false,
          dateOfBirth: '1995-11-12T06:00:00.000+0000',
          remainingEntitlement: {},
          originalEntitlement: {},
          usedEntitlement: {},
        },
      },
    };

    store = mockStore(state);

    const wrapper = mount(
      <Provider store={store}>
        <StatusPage />
      </Provider>,
    );

    expect(wrapper.find('.va-introtext').exists()).to.be.false;
    expect(wrapper.find('#print-button').exists()).to.be.false;

    wrapper.unmount();
  });

  it('should navigate to the print page when the print button is clicked', () => {
    const mockRouter = { push: sinon.spy() };

    const wrapper = mount(
      <Provider store={store}>
        <StatusPage router={mockRouter} />
      </Provider>,
    );

    const printButton = wrapper.find('#print-button').at(0);
    printButton.simulate('click');

    expect(mockRouter.push.calledOnce).to.be.true;
    expect(mockRouter.push.calledWithExactly('/print')).to.be.true;

    wrapper.unmount();
  });
});
