import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

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

  it('should render the correct message if the user is verified', () => {
    const wrapper = enzyme.shallow(<AccountVerification {...props} />);
    expect(wrapper.html()).to.contain('We’ve verified your identity.');
    wrapper.unmount();
  });

  it('should prompt to increase LOA when a user is not verified', () => {
    props.loa.current = 1;
    const wrapper = enzyme.shallow(<AccountVerification {...props} />);
    expect(wrapper.html()).to.contain('Verify your identity');
    wrapper.unmount();
  });
});
