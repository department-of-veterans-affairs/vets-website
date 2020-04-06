import React from 'react';
import enzyme from 'enzyme';

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

  test(
    'should render the profile and pass correct props to AccountVerification',
    () => {
      const wrapper = enzyme.shallow(<AccountMain {...props} />);
      expect(wrapper.find('TermsAndConditions')).toHaveLength(1);
      expect(wrapper.find('LoginSettings')).toHaveLength(1);
      const accountVerification = wrapper.find('AccountVerification');
      expect(accountVerification).toHaveLength(1);
      expect(accountVerification.props().loa).toEqual({ current: 3 });
      wrapper.unmount();
    }
  );

  test('should show an MVI error when status is not OK', () => {
    props.profile.status = 'NOT_FOUND';
    const wrapper = enzyme.shallow(<AccountMain {...props} />);
    const alertBox = wrapper.findWhere(
      n =>
        n.name() === 'AlertBox' &&
        n.prop('headline') ===
          'We’re having trouble matching your information to our Veteran records',
    );
    expect(alertBox.exists()).toBe(true);
    wrapper.unmount();
  });
});
