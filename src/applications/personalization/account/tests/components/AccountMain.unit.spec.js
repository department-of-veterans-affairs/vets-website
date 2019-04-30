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

  it('should render the profile and pass correct props to AccountVerification', () => {
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    expect(wrapper.find('TermsAndConditions')).to.have.lengthOf(1);
    expect(wrapper.find('LoginSettings')).to.have.lengthOf(1);
    const accountVerification = wrapper.find('AccountVerification');
    expect(accountVerification).to.have.lengthOf(1);
    expect(accountVerification.props().loa).to.deep.equal({ current: 3 });
    wrapper.unmount();
  });

  it('should show an MVI error when status is not OK', () => {
    props.profile.status = 'NOT_FOUND';
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    const alertBox = wrapper.find('AlertBox');
    expect(alertBox.html()).to.contain(
      'We’re having trouble matching your information to our Veteran records',
    );
    wrapper.unmount();
  });
});
