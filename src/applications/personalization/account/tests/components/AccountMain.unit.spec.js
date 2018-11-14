import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import AccountMain from '../../components/AccountMain';

describe('<AccountMain/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      profile: {
        status: 'OK',
        loa: {
          current: 3,
        },
        loading: false,
        mhvAccount: {
          loading: false,
        },
        multifactor: false,
        verified: true,
      },
      fetchMHVAccount: () => {},
    };
  });

  it('should render the profile when the user is verified and status OK', () => {
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    expect(wrapper.find('TermsAndConditions')).to.have.lengthOf(1);
    expect(wrapper.find('LoginSettings')).to.have.lengthOf(1);
    expect(wrapper.find('AccountVerification')).to.have.lengthOf(1);
    expect(wrapper.html()).to.contain('We’ve verified your identity.');
  });

  it('should prompt to increase LOA when a user is not verified', () => {
    props.profile.loa = 1;
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    expect(wrapper.html()).to.contain('Verify Your identity');
  });

  it('should show an MVI error when status is not OK', () => {
    props.profile.status = 'NOT_FOUND';
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    expect(wrapper.html()).to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
  });
});
