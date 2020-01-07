import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import VetTecVeteranPrograms from '../../components/vet-tec/VetTecVeteranPrograms';

const defaultProps = {
  institution: {
    programs: [
      {
        programType: 'NCD',
        description: 'C NET FULL STACK SOFTWARE DEVELOPER',
        lengthInHours: '540',
        lengthInWeeks: 540,
        providerWebsite: 'https://www.claimacademystl.com/',
        providerEmailAddress: 'info@claimacademystl.com',
        phoneAreaCode: '314',
        phoneNumber: '499-5888',
        schoolLocale: 'City',
        tuitionAmount: 12500,
        vaBah: 1733,
        dodBah: 1644,
        studentVetGroup: 'Y',
        studentVetGroupWebsite: 'https://claimacademystl.com/veterans.php',
        vetSuccessName: null,
        vetSuccessEmail: null,
      },
    ],
  },
  onShowModal: () => {},
};

describe('<VetTecVeteranPrograms>', () => {
  it('should render correct data if student veteran group is available', () => {
    const wrapper = mount(<VetTecVeteranPrograms {...defaultProps} />);
    expect(wrapper.length).to.eq(1);
    expect(wrapper.find('button').text()).to.eq('Student Veteran Group');
    wrapper.unmount();
  });

  it('should render correct data if VetSuccess on Campus program is available', () => {
    const props = {
      ...defaultProps,
      institution: {
        programs: [
          {
            ...defaultProps.institution.programs[0],
            studentVetGroup: null,
            studentVetGroupWebsite: null,
            vetSuccessName: 'Y',
            vetSuccessEmail: 'admin@test.com',
          },
        ],
      },
    };
    const wrapper = mount(<VetTecVeteranPrograms {...props} />);
    expect(wrapper.length).to.eq(1);
    expect(wrapper.find('button').text()).to.eq('VetSuccess on Campus');
    wrapper.unmount();
  });

  it('should display the contact school message if veteran programs are not available', () => {
    const props = {
      ...defaultProps,
      institution: {
        programs: [
          {
            ...defaultProps.institution.programs[0],
            studentVetGroup: null,
            studentVetGroupWebsite: null,
          },
        ],
      },
    };
    const wrapper = mount(<VetTecVeteranPrograms {...props} />);
    expect(wrapper.length).to.eq(1);
    expect(wrapper.find('p').text()).to.eq(
      'Please contact the school or their military office directly for information on the Veteran programs they offer.',
    );
    wrapper.unmount();
  });
});
