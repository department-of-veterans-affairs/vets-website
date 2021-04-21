import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import ProfileSectionHeadline from '@@profile/components/ProfileSectionHeadline';
import AccountSecurity from '@@profile/components/account-security/AccountSecurity';
import AccountSecurityContent from '@@profile/components/account-security/AccountSecurityContent';

describe('AccountSecurity', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<AccountSecurity />);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('renders a ProfileSectionHeadline component as its first child', () => {
    const firstChild = wrapper.childAt(0);
    expect(firstChild.type()).to.equal(ProfileSectionHeadline);
  });

  it('renders a properly configured DowntimeNotification component as its second child', () => {
    const secondChild = wrapper.childAt(1);
    expect(secondChild.type()).to.equal(DowntimeNotification);
    expect(secondChild.prop('dependencies')).to.deep.equal([
      externalServices.emis,
      externalServices.mvi,
    ]);
    expect(secondChild.children().type()).to.equal(AccountSecurityContent);
  });
});
