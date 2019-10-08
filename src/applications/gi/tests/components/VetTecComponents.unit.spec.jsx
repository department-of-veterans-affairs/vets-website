import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { VetTecScoContact } from '../../components/vet-tec/VetTecScoContact';
import VetTecContactInformation from '../../components/vet-tec/VetTecContactInformation';

const institution = {
  facilityCode: '2V000105',
  facilityMap: {
    main: {
      institution: {},
    },
  },
  address1: 'address 1',
  address2: 'address 2',
  address3: 'address 3',
  physicalAddress1: '6060 CENTER DRIVE #950',
  physicalAddress2: 'Address line 2',
  physicalAddress3: 'Address line 3',
  programs: [],
  schoolCertifyingOfficials: [
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
      priority: 'PRIMARY',
      firstName: 'MARTIN',
      lastName: 'INDIATSI',
      title: 'SCHOOL CERTIFYING OFFICIAL',
      phoneAreaCode: '303',
      phoneNumber: '749-0110',
      phoneExtension: null,
      email: 'VABENEFITS@GALVANIZE.COM',
    },
  ],
};

describe('<VetTecScoContact>', () => {
  it('should render', () => {
    const wrapper = shallow(<VetTecScoContact />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('return null when no sco is supplied', () => {
    expect(VetTecScoContact()).to.be.null;
  });

  it('return the contact information for an SCO', () => {
    const wrapper = shallow(
      VetTecScoContact(institution.schoolCertifyingOfficials[1]),
    );

    expect(wrapper.text().includes('MARTIN INDIATSI')).to.be.true;
    expect(wrapper.text().includes('SCHOOL CERTIFYING OFFICIAL')).to.be.true;
    expect(wrapper.text().includes('VABENEFITS@GALVANIZE.COM')).to.be.true;
    expect(wrapper.text().includes('303-749-0110')).to.be.true;
    wrapper.unmount();
  });
});

describe('<VetTecContactInformation>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecContactInformation institution={institution} />,
    );
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });
});
