import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import VetTecApplicationProcess from '../../../components/vet-tec/VetTecApplicationProcess';

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
describe('<VetTecApplicationProcess/>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <VetTecApplicationProcess institution={institution} />,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });
  it('renders without crashing', () => {
    const wrapper = mount(
      <VetTecApplicationProcess
        institution={{ programs: [{ providerWebsite: '' }] }}
      />,
    );
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
  });
  it('renders provider website link when a provider website is available', () => {
    const mockPrograms = [{ providerWebsite: 'http://example.com' }];
    const wrapper = mount(
      <VetTecApplicationProcess institution={{ programs: mockPrograms }} />,
    );

    expect(wrapper.find('a')).to.have.lengthOf(3);
    expect(
      wrapper
        .find('a')
        .at(1)
        .prop('href'),
    ).to.equal(mockPrograms[0].providerWebsite);
    wrapper.unmount();
  });
  it('renders the correct message when a provider website is not available', () => {
    const mockPrograms = [{ providerWebsite: '' }];
    const wrapper = mount(
      <VetTecApplicationProcess institution={{ programs: mockPrograms }} />,
    );

    expect(wrapper.find('a')).to.have.lengthOf(2);
    expect(
      wrapper
        .find('p')
        .at(1)
        .text(),
    ).to.include(
      'To learn more about these approved programs, visit the training provider’s website.',
    );
    wrapper.unmount();
  });
});
