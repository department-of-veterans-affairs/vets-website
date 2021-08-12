import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import NotInMPI from './NotInMPIError';

describe('NotInMPI', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<NotInMPI />);
  });

  it('should render the correct text', () => {
    expect(
      wrapper.text().includes('We’re having trouble verifying your identity'),
    ).to.be.true;
    expect(
      wrapper
        .text()
        .includes(
          'We’re sorry. We’re having trouble matching your information to our records. So we can’t give you access to VA.gov tools right now. Please contact the VA help desk',
        ),
    ).to.be.true;
    wrapper.unmount();
  });
});
