import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import LoginHeader from '../../../authentication/components/LoginHeader';

describe('LoginHeader', () => {
  let wrapper;
  const props = { loggedOut: false };

  beforeEach(() => {
    wrapper = shallow(<LoginHeader {...props} />);
  });

  it('should render Sign in content', () => {
    expect(wrapper.exists()).to.be.true;
  });
  it('should render a `LogoutAlert` if loggedOut is true', () => {});
  it('should render `DowntimeBanners`', () => {});
});
