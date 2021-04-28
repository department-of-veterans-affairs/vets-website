import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import { PROFILE_URL } from '../../constants';

import { ReviewDescription } from '../../components/ReviewDescription';

describe('<ReviewDescription>', () => {
  it('should render', () => {
    const wrapper = shallow(<ReviewDescription profile={{}} />);
    expect(wrapper.find('.form-review-panel-page-header-row').length).to.eq(1);
    wrapper.unmount();
  });
  it('should render profile data', () => {
    const profile = {
      vapContactInfo: {
        email: {
          emailAddress: 'test@foo.com',
        },
        homePhone: {
          areaCode: '503',
          countryCode: '1',
          extension: '0000',
          phoneNumber: '2222222',
          phoneType: 'HOME',
          updatedAt: '2018-04-21T20:09:50Z',
        },
        mailingAddress: {
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
      },
    };
    const wrapper = shallow(<ReviewDescription profile={profile} />);
    const text = wrapper.find('dl.review').text();
    const { email, homePhone, mailingAddress } = profile.vapContactInfo;
    const phone = wrapper.find('Telephone').props();

    expect(wrapper.find('h4').text()).to.eq('Contact information');
    expect(wrapper.find('a').props().href).to.contain(PROFILE_URL);
    expect(phone.contact).to.eq(homePhone.areaCode + homePhone.phoneNumber);
    expect(phone.extension).to.eq(homePhone.extension);

    expect(text).to.contain(`Email address${email.emailAddress}`);
    expect(text).to.contain(`Street address${mailingAddress.addressLine1}`);
    expect(text).to.contain(`Postal code${mailingAddress.zipCode}`);

    wrapper.unmount();
  });
});
