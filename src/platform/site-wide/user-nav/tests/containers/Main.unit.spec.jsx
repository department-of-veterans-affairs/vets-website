import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Main } from '../../containers/Main';

const defaultProps = {
  currentlyLoggedIn: false,
  isProfileLoading: false,
  isLOA3: false,
  userGreeting: null,
  showLoginModal: false,
  utilitiesMenuIsOpen: {
    search: false,
    help: false,
    account: false,
  },
};

describe('<Main>', () => {
  it('should render', () => {
    const wrapper = shallow(<Main {...defaultProps} />);
    expect(wrapper.find('SearchHelpSignIn').exists()).to.be.true;
    expect(wrapper.find('SignInModal').exists()).to.be.true;
  });
});
