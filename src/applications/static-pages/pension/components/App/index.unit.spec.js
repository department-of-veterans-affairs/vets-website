import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('Pension Widget <App>', () => {
  it('renders the pension widget app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('h2').text()).to.equal(
      `Our online pension form isn’t working right now`,
    );
    wrapper.unmount();
  });

  it('shows "Refer to your saved form" link when user is logged in', () => {
    const wrapper = shallow(<App loggedIn />);
    expect(wrapper.find('a[href="/"]').exists()).to.equal(true);
    wrapper.unmount();
  });

  it('shows "Sign in or create an account" button when user is not logged in', () => {
    const wrapper = shallow(<App loggedIn={false} />);
    expect(wrapper.find('va-button').exists()).to.equal(true);
    wrapper.unmount();
  });

  it('calls toggleLoginModal when "Sign in or create an account" button is clicked', () => {
    const toggleLoginMock = {
      called: false,
      call() {
        this.called = true;
      },
    };

    const wrapper = shallow(
      <App
        loggedIn={false}
        toggleLoginModal={toggleLoginMock.call.bind(toggleLoginMock)}
      />,
    );
    wrapper.find('va-button').simulate('click');
    expect(toggleLoginMock.called).to.equal(true);
    wrapper.unmount();
  });
});
