import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ReviewDescription from '../../containers/ReviewDescription';

const formData = {
  veteran: {
    phoneNumber: '1234567890',
    emailAddress: 'foo@bar.com',
    country: 'USA',
    street: '123 MAIN Street',
    city: 'Townsville',
    state: 'AB',
    zipCode5: '98765',
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
    expect(rows.at(2).text()).to.contain('Street address123 MAIN Street');
    expect(rows.at(3).text()).to.contain('CityTownsville');
    expect(rows.at(4).text()).to.contain('StateAB');
    expect(rows.at(5).text()).to.contain('Postal code98765');
    tree.unmount();
  });

  it('should render country & other street address lines', () => {
    const extendedData = {
      veteran: {
        ...formData.veteran,
        country: 'AUS',
        street2: 'SECTION 5',
        street3: 'UNIT A33',
      },
    };
    const tree = shallow(<ReviewDescription formData={extendedData} />);

    const rows = tree.find('.review-row');
    expect(rows.length).to.equal(9);
    expect(rows.at(0).text()).to.contain('Phone number123-456-7890');
    expect(rows.at(1).text()).to.contain('Email addressfoo@bar.com');
    expect(rows.at(2).text()).to.contain('CountryAustralia');
    expect(rows.at(3).text()).to.contain('Street address123 MAIN Street');
    expect(rows.at(4).text()).to.contain('Line 2SECTION 5');
    expect(rows.at(5).text()).to.contain('Line 3UNIT A33');
    expect(rows.at(6).text()).to.contain('CityTownsville');
    expect(rows.at(7).text()).to.contain('StateAB');
    expect(rows.at(8).text()).to.contain('Postal code98765');
    tree.unmount();
  });
});
