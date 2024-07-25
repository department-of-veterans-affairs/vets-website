import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import SearchHelpSignIn from '../../components/SearchHelpSignIn.jsx';

describe('<SearchHelpSignIn>', () => {
  const defaultProps = {
    isLOA3: false,
    isLoggedIn: false,
    isMenuOpen: {
      account: false,
      help: false,
      search: false,
    },
    isProfileLoading: false,
    onSignInSignUp: sinon.spy(),
    toggleMenu: sinon.spy(),
    userGreeting: 'test@vets.gov',
  };

  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      location: {
        hostname: 'www.va.gov',
        replace: () => {},
        pathname: '/',
      },
    });
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should present login links when not logged in on VA subdomain', () => {
    window.location.hostname = 'www.benefits.va.gov';
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    expect(
      wrapper
        .find('.sign-in-link')
        .at(0)
        .prop('href'),
    ).to.equal('https://www.va.gov/my-va');
    wrapper.unmount();
  });

  it('should render <SignInProfileMenu/> when logged in', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} isLoggedIn />);
    expect(wrapper.find('SignInProfileMenu').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should display the user email or name when logged in', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} isLoggedIn />);
    const dropdown = wrapper
      .find('SignInProfileMenu')
      .dive()
      .find('PersonalizationDropDownPanel')
      .dive();
    expect(dropdown.text()).to.contain(defaultProps.userGreeting);
    wrapper.unmount();
  });

  it('should show the login modal when the sign in link is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    const clickEvent = { preventDefault: sinon.spy() };
    wrapper.find('.sign-in-link').simulate('click', clickEvent);
    expect(clickEvent.preventDefault.calledOnce).to.be.true;
    expect(defaultProps.onSignInSignUp.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should open the search bar when the search dropdown is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    wrapper.find('Connect(SearchMenu)').prop('clickHandler')();
    expect(defaultProps.toggleMenu.calledWith('search', true)).to.be.true;
    wrapper.unmount();
  });

  it('should have a link to Contact us', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    const linkProps = wrapper
      .find('a')
      .at(0)
      .props();
    expect(linkProps.href).to.equal('https://www.va.gov/contact-us/');
    expect(linkProps.children).to.equal('Contact us');
    wrapper.unmount();
  });

  it('should open the user menu when the user name is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} isLoggedIn />);
    wrapper.find('SignInProfileMenu').prop('clickHandler')();
    expect(defaultProps.toggleMenu.calledWith('account', true)).to.be.true;
    wrapper.unmount();
  });
});
