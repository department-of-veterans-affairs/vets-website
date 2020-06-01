import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import IdentityNotVerified from '../../components/IdentityNotVerified';

describe('IdentityNotVerified', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<IdentityNotVerified />);
  });

  it('should render the correct text', () => {
    expect(wrapper.text().includes('Verify your identity to view your profile'))
      .to.be.true;
    wrapper.unmount();
  });

  it('should render the correct link', () => {
    const link = wrapper.find('a');
    expect(link.text().includes('Verify with ID.me')).to.be.true;
    expect(link.prop('href')).to.equal('/verify');
    wrapper.unmount();
  });

  it('should render AdditionalInfo', () => {
    const additionalInfo = wrapper.find('AdditionalInfo');
    expect(additionalInfo.text().includes('How will VA.gov verify my identity'))
      .to.be.true;
    wrapper.unmount();
  });
});
