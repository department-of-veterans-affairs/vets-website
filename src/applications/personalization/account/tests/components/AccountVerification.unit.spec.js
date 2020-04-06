import React from 'react';
import enzyme from 'enzyme';

import AccountVerification from '../../components/AccountVerification';

describe('<AccountVerification />', () => {
  let props = null;

  beforeEach(() => {
    props = {
      loa: {
        current: 3,
      },
    };
  });

  test('should render the correct message if the user is verified', () => {
    const wrapper = enzyme.shallow(<AccountVerification {...props} />);
    expect(wrapper.html()).toEqual(
      expect.arrayContaining(['We’ve verified your identity.']),
    );
    wrapper.unmount();
  });

  test('should prompt to increase LOA when a user is not verified', () => {
    props.loa.current = 1;
    const wrapper = enzyme.shallow(<AccountVerification {...props} />);
    expect(wrapper.html()).toEqual(
      expect.arrayContaining(['Verify your identity']),
    );
    wrapper.unmount();
  });
});
