import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import NotInMVI from '../../components/NotInMPIError';

describe('NotInMVI', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<NotInMVI />);
  });

  it('should render the correct text', () => {
    expect(
      wrapper
        .text()
        .includes('We can’t match your information to our Veteran records'),
    ).to.be.true;
    expect(
      wrapper
        .text()
        .includes(
          'We’re sorry. We can’t give you access to your profile or account information until we can match your information and verify your identity.',
        ),
    ).to.be.true;
    expect(
      wrapper
        .text()
        .includes(
          'If you’d like to access these tools, please contact the VA.gov help desk at 844-698-2311 (TTY: 711) to verify and update your records.',
        ),
    ).to.be.true;
    wrapper.unmount();
  });
});
