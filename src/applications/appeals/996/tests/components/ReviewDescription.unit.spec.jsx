import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import { PROFILE_URL } from '../../constants';

import { ReviewDescription } from '../../components/ReviewDescription';

describe('<ReviewDescription>', () => {
  it('should render', () => {
    const wrapper = shallow(<ReviewDescription veteran={{}} />);
    expect(wrapper.find('.form-review-panel-page-header-row').length).to.eq(1);
    wrapper.unmount();
  });
  it('should render profile data', () => {
    const veteran = {
      email: 'test@foo.com',
      phone: {
        areaCode: '503',
        countryCode: '1',
        extension: '0000',
        phoneNumber: '2222222',
        phoneType: 'HOME',
        updatedAt: '2018-04-21T20:09:50Z',
      },
      address: {
        addressLine1: '1493 Martin Luther King Rd',
        addressLine2: 'Apt 1',
        addressLine3: '',
        addressType: ADDRESS_TYPES.domestic,
        city: 'Fulton',
        countryName: 'United States',
        countryCodeFips: 'US',
        countryCodeIso2: 'US',
        countryCodeIso3: 'USA',
        internationalPostalCode: '54321',
        stateCode: 'NY',
        updatedAt: '2018-04-21T20:09:50Z',
        zipCode: '97062',
        zipCodeSuffix: '1234',
      },
    };
    const wrapper = shallow(<ReviewDescription veteran={veteran} />);
    const text = wrapper.find('dl.review').text();
    const { email, phone, address } = veteran;
    const phoneProps = wrapper.find('va-telephone').props();

    expect(wrapper.find('h4').text()).to.eq('Contact information');
    expect(wrapper.find('a').props().href).to.contain(PROFILE_URL);
    expect(phoneProps.contact).to.eq(phone.areaCode + phone.phoneNumber);
    expect(phoneProps.extension).to.eq(phone.extension);

    expect(text).to.contain(`Email address${email}`);
    expect(text).to.contain(`Street address${address.addressLine1}`);
    expect(text).to.contain(`Postal code${address.zipCode}`);

    wrapper.unmount();
  });
});
