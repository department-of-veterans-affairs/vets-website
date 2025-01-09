import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
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
  it('renders with default values', () => {
    const wrapper = shallow(
      <VetTecAdditionalInformation institution={{}} showModal={() => {}} />,
    );

    const facilityCodeButton = wrapper.find('#facilityCode-button');

    expect(facilityCodeButton).to.have.lengthOf(1);
    expect(facilityCodeButton.prop('children')).to.equal('VA facility code:');
    expect(wrapper.text()).to.include('N/A');
    wrapper.unmount();
  });

  it('renders with a facility code', () => {
    const facilityCode = '12345';
    const wrapper = shallow(
      <VetTecAdditionalInformation
        institution={{ facilityCode }}
        showModal={() => {}}
      />,
    );

    expect(wrapper.text().includes('facility code: 12345')).to.be.false;
    wrapper.unmount();
  });

  it('calls showModal function when the "Learn More" button is clicked', () => {
    const showModalMock = sinon.spy();
    const wrapper = shallow(
      <VetTecAdditionalInformation
        institution={{}}
        showModal={showModalMock}
      />,
    );

    wrapper.find('#facilityCode-button').simulate('click');

    expect(showModalMock.calledWith('facilityCode')).to.be.true;
    wrapper.unmount();
  });
});
