import React from 'react';
import { mount } from 'enzyme';
import { Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import MyHealthAccessGuard from '~/platform/mhv/util/route-guard';

const mockStore = configureStore([]);

describe('<MyHealthAccessGuard />', () => {
  it('renders its children if mhvAccountState is OK', () => {
    const store = mockStore({
      user: {
        profile: {
          mhvAccountState: 'OK',
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MyHealthAccessGuard>
          <div id="child-component" />
        </MyHealthAccessGuard>
      </Provider>,
    );

    expect(wrapper.find('#child-component')).to.have.lengthOf(1);
    expect(wrapper.find(Redirect)).to.have.lengthOf(0);

    wrapper.unmount();
  });

  it('redirects to /my-health if mhvAccountState is NONE', () => {
    const store = mockStore({
      user: {
        profile: {
          mhvAccountState: 'NONE',
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MyHealthAccessGuard>
          <div id="child-component" />
        </MyHealthAccessGuard>
      </Provider>,
    );

    expect(wrapper.find(Redirect)).to.have.lengthOf(1);
    expect(wrapper.find(Redirect).props().to).to.equal('/my-health');

    wrapper.unmount();
  });
});
