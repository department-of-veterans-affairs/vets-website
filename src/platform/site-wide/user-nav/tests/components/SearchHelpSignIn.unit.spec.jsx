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
    userGreeting: 'test@vets.gov',
    toggleLoginModal: sinon.spy(),
    toggleMenu: sinon.spy(),
  };

  const oldWindow = global.window;

  beforeEach(() => {
    global.window = {
      location: {
        hostname: 'www.va.gov',
        replace: () => {},
        pathname: '/',
      },
      settings: {
        brandConsolidationEnabled: true,
      },
    };
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should present login links when not logged in', () => {
    window.settings.brandConsolidationEnabled = false;
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    expect(wrapper.find('.sign-in-link')).to.have.lengthOf(2);
    wrapper.unmount();
  });

  it('should present login links when not logged in on VA subdomain', () => {
    window.settings.brandConsolidationEnabled = true;
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
      .find('DropDownPanel')
      .dive();
    expect(dropdown.text()).to.contain(defaultProps.userGreeting);
    wrapper.unmount();
  });

  it('should show the login modal when the sign in link is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    const clickEvent = { preventDefault: sinon.spy() };
    wrapper.find('.sign-in-link').simulate('click', clickEvent);
    expect(clickEvent.preventDefault.calledOnce).to.be.true;
    expect(defaultProps.toggleLoginModal.calledOnce).to.be.true;
    expect(defaultProps.toggleLoginModal.calledWith(true)).to.be.true;
    wrapper.unmount();
  });

  it('should open the search bar when the search dropdown is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    wrapper.find('SearchMenu').prop('clickHandler')();
    expect(defaultProps.toggleMenu.calledWith('search', true)).to.be.true;
    wrapper.unmount();
  });

  it('should open the help menu when the help dropdown is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} />);
    wrapper.find('HelpMenu').prop('clickHandler')();
    expect(defaultProps.toggleMenu.calledWith('help', true)).to.be.true;
    wrapper.unmount();
  });

  it('should open the user menu when the user name is clicked', () => {
    const wrapper = shallow(<SearchHelpSignIn {...defaultProps} isLoggedIn />);
    wrapper.find('SignInProfileMenu').prop('clickHandler')();
    expect(defaultProps.toggleMenu.calledWith('account', true)).to.be.true;
    wrapper.unmount();
  });
});
