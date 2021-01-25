import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ContactInformation from '../../../components/profile/ContactInformation';

const institution = {
  versionedSchoolCertifyingOfficials: [
    {
      priority: 'PRIMARY',
      firstName: 'ADM',
      lastName: '1N',
      title: 'ROBOTIC ADMISSIONS OFFICAL',
      phoneAreaCode: '555',
      phoneNumber: '123-9874',
      phoneExtension: '222',
      email: 'A1N@GALVALNIZE.COM',
    },
    {
      facilityCode: '2V000203',
      institutionName: 'GALVANIZE INC',
      priority: 'SECONDARY',
      firstName: 'MARTIN',
      lastName: 'INDIATSI',
      title: 'SCHOOL CERTIFYING OFFICIAL',
      phoneAreaCode: '303',
      phoneNumber: '749-0110',
      phoneExtension: null,
      email: 'VABENEFITS@GALVANIZE.COM',
    },
    {
      priority: 'primary',
      firstName: 'TOM',
      lastName: 'TERST',
      title: 'TEST',
      phoneAreaCode: '555',
      phoneNumber: '123-9874',
      phoneExtension: '222',
      email: 'TEST@GALVALNIZE.COM',
    },
    {
      facilityCode: '2V000203',
      institutionName: 'GALVANIZE INC',
      priority: 'secondary',
      firstName: 'MARTY',
      lastName: 'INDIATSI',
      title: 'SCHOOL CERTIFYING OFFICIAL',
      phoneAreaCode: '303',
      phoneNumber: '749-0110',
      phoneExtension: null,
      email: 'VABENEFITS@GALVANIZE.COM',
    },
  ],
};

describe('<ContactInformation>', () => {
  it('should render', () => {
    const wrapper = shallow(<ContactInformation institution={institution} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should display primary SCOs', () => {
    const wrapper = shallow(<ContactInformation institution={institution} />);
    expect(wrapper.find('.primary-sco-list li').length).to.eq(2);
    wrapper.unmount();
  });
});
