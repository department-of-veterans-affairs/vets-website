import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SuggestedAddressRadio from '../../components/SuggestedAddressRadio';

describe('Suggested Address Radio Component', () => {
  const mockSuggestedAddress = {
    addressLine1: '1477 Theresa Dr',
    addressType: 'DOMESTIC',
    city: 'Charleston',
    countryName: 'United States',
    countryCodeIso3: 'USA',
    countyCode: '45019',
    countyName: 'Charleston County',
    stateCode: 'SC',
    zipCode: '29412',
    zipCodeSuffix: '3219',
  };

  const mockUserAddress = {
    street: '1234 Mock St',
    city: 'Mock City',
    state: 'MC',
    zipCode: '12345',
    country: 'USA',
  };
  const mockOnChangeSelectedAddress = () => {};
  const props = {
    title: 'Confirm your mailing address',
    userAddress: mockUserAddress, // not mockUserAddress: ...
    selectedAddress: mockUserAddress, // or null/empty if you want
    suggestedAddress: mockSuggestedAddress,
    onChangeSelectedAddress: mockOnChangeSelectedAddress,
  };

  it('should render', () => {
    const wrapper = mount(<SuggestedAddressRadio {...props} />);
    expect(wrapper.find('va-radio-option').length).to.equal(2);
    wrapper.unmount();
  });

  // it('should invoke onChange when a radio button is clicked', () => {
  //   const onChange = sinon.spy();
  //   const wrapper = mount(
  //     <PreparerRadioWidget {...props} onChange={onChange} />,
  //   );

  //   const vaRadio = wrapper.find('VaRadio');
  //   expect(vaRadio.exists()).to.be.true;

  //   vaRadio
  //     .props()
  //     .onVaValueChange({ detail: { value: 'Pinhead', checked: true } });
  //   expect(onChange.calledWith('Pinhead')).to.be.true;
  //   wrapper.unmount();
  // });
});
