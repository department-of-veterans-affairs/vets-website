import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ReviewDescription } from '../../components/ReviewDescription';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

const profile = (addressOptions = {}) => ({
  vapContactInfo: {
    email: {
      emailAddress: 'foo@bar.com',
    },
    homePhone: {
      areaCode: '321',
      phoneNumber: '4567890',
    },
    mailingAddress: {
      addressType: ADDRESS_TYPES.domestic,
      countryName: 'United States',
      countryCodeIso3: 'USA',
      addressLine1: '123 MAIN Street',
      city: 'Townsville',
      stateCode: 'AB',
      zipCode: '98765',
      ...addressOptions,
    },
  },
});

// Displayed on the review & submit page
describe('Review description', () => {
  it('should render contact info', () => {
    const tree = shallow(<ReviewDescription profile={profile()} />);

    const rows = tree.find('.review-row');
    // country is not shown if it's the U.S.
    expect(rows.length).to.equal(6);
    expect(rows.at(0).text()).to.contain('Phone number');
    expect(
      rows
        .find('Telephone')
        .dive()
        .text(),
    ).to.contain('321-456-7890');
    expect(rows.at(1).text()).to.contain('Email addressfoo@bar.com');
    expect(rows.at(2).text()).to.contain('Street address123 MAIN Street');
    expect(rows.at(3).text()).to.contain('CityTownsville');
    expect(rows.at(4).text()).to.contain('StateAB');
    expect(rows.at(5).text()).to.contain('Postal code98765');
    tree.unmount();
  });

  it('should render country & other street address lines', () => {
    const extendedData = profile({
      addressType: ADDRESS_TYPES.international,
      countryName: 'Australia',
      countryCodeIso3: 'AU',
      addressLine2: 'SECTION 5',
      addressLine3: 'UNIT A33',
      province: 'Queensland',
      internationalPostalCode: '23456',
    });
    const tree = shallow(<ReviewDescription profile={extendedData} />);

    const rows = tree.find('.review-row');
    expect(rows.length).to.equal(9);
    expect(rows.at(0).text()).to.contain('Phone number');
    expect(
      rows
        .find('Telephone')
        .dive()
        .text(),
    ).to.contain('321-456-7890');
    expect(rows.at(1).text()).to.contain('Email addressfoo@bar.com');
    expect(rows.at(2).text()).to.contain('CountryAustralia');
    expect(rows.at(3).text()).to.contain('Street address123 MAIN Street');
    expect(rows.at(4).text()).to.contain('Line 2SECTION 5');
    expect(rows.at(5).text()).to.contain('Line 3UNIT A33');
    expect(rows.at(6).text()).to.contain('CityTownsville');
    expect(rows.at(7).text()).to.contain('ProvinceQueensland');
    expect(rows.at(8).text()).to.contain('Postal code23456');
    tree.unmount();
  });
});
