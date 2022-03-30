import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LogoutAlert from 'platform/user/authentication/components/LogoutAlert';

describe('LogoutAlert', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LogoutAlert />);
  });
  afterEach(() => wrapper.unmount());

  it('should render', () => {
    expect(wrapper.find('h2').text()).includes('signed out');
    wrapper.unmount();
  });

  it('should verify URL links are correct', () => {
    expect(wrapper.find('Connect(EbenefitsLink)').exists()).to.be.true;
    expect(wrapper.find('[data-testid="mhv"]').prop('href')).to.eql(
      'https://www.myhealth.va.gov',
    );
    expect(wrapper.find('[data-testid="mhv"]').prop('href')).includes('/');
    wrapper.unmount();
  });
});
