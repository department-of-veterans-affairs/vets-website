import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ApplicantIdentityView from '../../../components/ApplicantIdentityView';

describe('ApplicantIdentityView', () => {
  const formData = {
    'view:userFullName': {
      userFullName: {
        first: 'John',
        middle: 'M',
        last: 'Doe',
      },
    },
    dateOfBirth: '1990-01-01',
  };
  it('should render the user full name and formatted date of birth', () => {
    const wrapper = mount(<ApplicantIdentityView formData={formData} />);
    expect(wrapper.text()).to.include('John M Doe');
    expect(wrapper.text()).to.include('January 1st, 1990');
    wrapper.unmount();
  });
  it('should not render the component if formData is missing required data', () => {
    const incompleteFormData = {
      'view:userFullName': {
        userFullName: {
          first: 'John',
          middle: 'M',
          last: 'Doe',
        },
      },
    };

    it('should render the paragraph content correctly', () => {
      const wrapper = mount(<ApplicantIdentityView formData={formData} />);
      expect(
        wrapper
          .find('p')
          .at(0)
          .text(),
      ).to.equal(
        'We have this personal information on file for you. Any updates you make will change the information for your education benefits only. If you want to update your personal information for other VA benefits, update your information on your profile.',
      );
      expect(
        wrapper
          .find('p')
          .at(1)
          .text(),
      ).to.contain(
        'If you want to request that we change your name or date of birth, you will need to send additional information. Learn more on how to change your legal name on file with VA.',
      );
      wrapper.unmount();
    });
    const wrapper = mount(
      <ApplicantIdentityView formData={incompleteFormData} />,
    );
    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
});
