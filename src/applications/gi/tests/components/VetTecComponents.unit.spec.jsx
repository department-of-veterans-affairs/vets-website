import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import createCommonStore from 'platform/startup/store';

import { VetTecScoContact } from '../../components/vet-tec/VetTecScoContact';
import VetTecContactInformation from '../../components/vet-tec/VetTecContactInformation';
import VetTecApprovedPrograms from '../../components/vet-tec/VetTecApprovedPrograms';
import VetTecHeadingSummary from '../../components/vet-tec/VetTecHeadingSummary';
import VetTecVeteranPrograms from '../../components/vet-tec/VetTecVeteranPrograms';
import VetTecApplicationProcess from '../../components/vet-tec/VetTecApplicationProcess';

const institution = {
  facilityCode: '2V000105',
  city: 'LOS ANGELES',
  state: 'CA',
  zip: '90045',
  country: 'USA',
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
  programs: [
    {
      description: 'Program Name',
      schoolLocale: 'City',
      providerWebsite: 'https://galvanize.edu',
      phoneAreaCode: '843',
      phoneNumber: '333-3333',
    },
  ],
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
      VetTecScoContact(institution.versionedSchoolCertifyingOfficials[1]),
    );

    expect(wrapper.text().includes('MARTIN INDIATSI')).to.be.true;
    expect(wrapper.text().includes('SCHOOL CERTIFYING OFFICIAL')).to.be.true;
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

describe('<VetTecApplicationProcess>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecApplicationProcess institution={institution} />,
    );
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });
});

describe('<VetTecApprovedProgram>', () => {
  it('should render', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
    };
    const wrapper = shallow(<VetTecApprovedPrograms {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should display 0 hours as TBD', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution: {
        ...institution,
        programs: [
          {
            description: 'Program Name',
            schoolLocale: 'City',
            providerWebsite: 'https://galvanize.edu',
            phoneAreaCode: '843',
            phoneNumber: '333-3333',
            lengthInHours: '0',
          },
        ],
      },
    };
    const wrapper = mount(<VetTecApprovedPrograms {...defaultProps} />);
    expect(wrapper.find('.program-length').length).to.eq(1);
    expect(wrapper.find('.program-length').text()).to.eq('TBD');
    wrapper.unmount();
  });
});

describe('<VetTecHeadingSummary>', () => {
  it('should render', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
    };

    const wrapper = shallow(<VetTecHeadingSummary {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });
});

describe('<VetTecPrograms>', () => {
  const onShowModal = () => {};
  it('should render', () => {
    const defaultProps = {
      store: createCommonStore(),
      institution,
      onShowModal,
    };

    const wrapper = shallow(<VetTecVeteranPrograms {...defaultProps} />);
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    wrapper.unmount();
  });
});
