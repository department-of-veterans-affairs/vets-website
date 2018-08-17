import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SearchHelpSignIn from '../../components/SearchHelpSignIn.jsx';

const defaultProps = {
  isLoggedIn: false,
  isMenuOpen: {
    account: false,
    help: false,
    search: false
  },
  isUserRegisteredForBeta: () => {},
  isProfileLoading: false,
  userGreeting: 'test@vets.gov',
  toggleLoginModal: () => {},
  toggleMenu: () => {}
};

describe('<SearchHelpSignIn>', () => {
  beforeEach(() => {
    global.window = {
      location: {
        replace: () => {},
      }
    };
    global.window.location.pathname = '/';
  });

  it('should present login links when not logged in', () => {
    const wrapper = shallow(
      <SearchHelpSignIn {...defaultProps}/>
    );
    expect(wrapper.find('.sign-in-link')).to.have.lengthOf(1);
  });
});
