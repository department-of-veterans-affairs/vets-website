import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ReviewDescription from '../../containers/ReviewDescription';

const formData = {
  veteran: {
    phoneNumber: '1234567890',
    emailAddress: 'foo@bar.com',
    countryCode: 'USA',
    addressLine1: '123 MAIN Street',
    city: 'TownsVILLE',
    stateOrProvinceCode: 'AB',
    zipPostalCode: '98765',
  },
};

// Displayed on the review & submit page
describe('Review description', () => {
  it('should render contact info', () => {
    const tree = shallow(<ReviewDescription formData={formData} />);

    const rows = tree.find('.review-row');
    // country is not shown if it's the U.S.
    expect(rows.length).to.equal(6);
    expect(rows.at(0).text()).to.contain('Phone number123-456-7890');
    expect(rows.at(1).text()).to.contain('Email addressfoo@bar.com');
    expect(rows.at(2).text()).to.contain('Street address123 Main Street');
    expect(rows.at(3).text()).to.contain('CityTownsville');
    expect(rows.at(4).text()).to.contain('StateAB');
    expect(rows.at(5).text()).to.contain('Postal code98765');
    tree.unmount();
  });

  it('should render country & other street address lines', () => {
    const extendedData = {
      veteran: {
        ...formData.veteran,
        countryCode: 'AUS',
        addressLine2: 'SECTION 5',
        addressLine3: 'UNIT A33',
      },
    };
    const tree = shallow(<ReviewDescription formData={extendedData} />);

    const rows = tree.find('.review-row');
    expect(rows.length).to.equal(9);
    expect(rows.at(0).text()).to.contain('Phone number123-456-7890');
    expect(rows.at(1).text()).to.contain('Email addressfoo@bar.com');
    expect(rows.at(2).text()).to.contain('CountryAustralia');
    expect(rows.at(3).text()).to.contain('Street address123 Main Street');
    expect(rows.at(4).text()).to.contain('Line 2Section 5');
    expect(rows.at(5).text()).to.contain('Line 3Unit A33');
    expect(rows.at(6).text()).to.contain('CityTownsville');
    expect(rows.at(7).text()).to.contain('StateAB');
    expect(rows.at(8).text()).to.contain('Postal code98765');
    tree.unmount();
  });
});
