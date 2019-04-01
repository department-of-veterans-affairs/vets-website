import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { ApplicantInformation } from '../../../0994/components/ApplicantInformation';

const formData = {
  applicantFullName: {
    first: 'Jane',
    middle: 'Q',
    last: 'Doe',
  },
  applicantGender: 'F',
  dateOfBirth: '1950-01-01',
  applicantSocialSecurityNumber: '123456789',
};

describe('<ApplicantInformation>', () => {
  it('should render', () => {
    const component = mount(<ApplicantInformation formData={formData} />);

    const text = component.text();
    expect(text).to.contain(
      'This is the personal information we have on file for you.',
    );
    expect(text).to.contain('Jane Q Doe');
    expect(text).to.contain('Female');
    expect(text).to.contain('01/01/1950');
    expect(text).to.contain('●●●–●●–ending with6789');

    component.unmount();
  });
});
