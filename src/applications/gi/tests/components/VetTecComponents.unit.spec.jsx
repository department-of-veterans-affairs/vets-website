import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import createCommonStore from 'platform/startup/store';

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
};

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
