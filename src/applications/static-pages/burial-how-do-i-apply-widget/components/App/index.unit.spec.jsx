import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { App } from '.';

describe('Burial Widget <App>', () => {
  let replaceStateSpy;

  beforeEach(() => {
    replaceStateSpy = sinon.spy(window.history, 'replaceState');
  });

  afterEach(() => {
    replaceStateSpy.restore();
  });

  it('renders the burial widget app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('h3').text()).to.equal(
      `Our online burial benefits form isn’t working right now`,
    );
    wrapper.unmount();
  });

  it('shows "Refer to your saved form" link when user is logged in', () => {
    const wrapper = shallow(<App loggedIn />);
    const selector =
      'a[href="/burials-and-memorials/application/530/introduction"]';
    expect(wrapper.find(selector).exists()).to.equal(true);
    wrapper.unmount();
  });

  it('shows "Sign in to VA.gov" button when user is not logged in', () => {
    const wrapper = shallow(<App loggedIn={false} />);
    expect(
      wrapper.find('va-button[text="Sign in to VA.gov"]').exists(),
    ).to.equal(true);
    wrapper.unmount();
  });

  it('calls toggleLoginModal when "Sign in to VA.gov" button is clicked', () => {
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

  it('sets the correct return URL in sessionStorage when the va-button is clicked', () => {
    const wrapper = shallow(
      <App loggedIn={false} toggleLoginModal={() => {}} />,
    );

    wrapper.find('va-button').simulate('click');

    expect(sessionStorage.getItem('authReturnUrl')).to.equal(
      `${
        window.location.origin
      }/burials-and-memorials/application/530/introduction/`,
    );

    wrapper.unmount();
  });
});
