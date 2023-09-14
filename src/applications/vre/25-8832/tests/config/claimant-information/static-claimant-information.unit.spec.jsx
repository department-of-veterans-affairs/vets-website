import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import staticClaimantInformation from '../../../config/chapters/claimant-information/staticClaimantComponent.jsx';

describe.skip('Chapter 36 Static Claimant Information', () => {
  const mockUser = {
    gender: 'M',
    dob: '12-12-20',
    userFullName: {
      first: 'John',
      last: 'Doe',
    },
  };

  it('should render', () => {
    const component = mount(<staticClaimantInformation user={mockUser} />);
    expect(component.find('dl')).to.exist;
    expect(component.find('dt')).to.exist;
    expect(component.find('dd')).to.exist;
    component.unmount();
  });
});
