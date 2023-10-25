import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { App, mapDispatchToProps, mapStateToProps } from '.';

describe('Pension Widget <App>', () => {
  let replaceStateSpy;

  beforeEach(() => {
    replaceStateSpy = sinon.spy(window.history, 'replaceState');
  });

  afterEach(() => {
    replaceStateSpy.restore();
  });

  it('renders the pension widget app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('h3').text()).to.equal(
      `You can’t apply online right now`,
    );
    wrapper.unmount();
  });

  it('shows "Refer to your saved form" link when user is logged in', () => {
    const wrapper = shallow(<App loggedIn />);
    const selector = 'va-link[href="/pension/application/527EZ/introduction"]';
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
    const toggleLoginMock = sinon.spy();

    const wrapper = shallow(
      <App loggedIn={false} toggleLoginModal={toggleLoginMock} />,
    );
    wrapper.find('va-button').simulate('click');
    expect(toggleLoginMock.called).to.equal(true);
    wrapper.unmount();
  });

  it('sets the correct return URL in sessionStorage when the va-button is clicked', () => {
    const mockSessionStorage = {
      setItem: sinon.spy(),
    };
    global.sessionStorage = mockSessionStorage; // This mocks the global sessionStorage for this test

    const wrapper = shallow(
      <App loggedIn={false} toggleLoginModal={() => {}} />,
    );

    wrapper.find('va-button').simulate('click');

    expect(mockSessionStorage.setItem.calledOnce).to.equal(true);
    expect(
      mockSessionStorage.setItem.calledWith(
        'authReturnUrl',
        `${window.location.origin}/pension/application/527EZ/introduction/`,
      ),
    ).to.equal(true);

    wrapper.unmount();
  });

  describe('mapStateToProps', () => {
    it('should render appropriately', () => {
      const goodObj = { user: { login: { currentlyLoggedIn: false } } };
      expect(mapStateToProps(goodObj)).to.eql({ loggedIn: false });
    });
  });

  describe('mapDispatchToProps', () => {
    it('does it', () => {
      const dispatchSpy = sinon.spy();
      const props = mapDispatchToProps(dispatchSpy);

      props.toggleLoginModal(true);

      expect(dispatchSpy.calledOnce).to.be.true;
      expect(dispatchSpy.calledWithExactly(toggleLoginModalAction(true))).to.be
        .true;
    });
  });
});
