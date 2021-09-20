import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VetTecAdditionalInformation from '../../../components/vet-tec/VetTecAdditionalInformation';

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
describe('<VetTecAdditionalInformation/>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecAdditionalInformation institution={institution} />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
});
