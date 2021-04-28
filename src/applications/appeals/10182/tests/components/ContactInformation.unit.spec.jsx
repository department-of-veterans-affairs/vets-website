import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

import { ContactInfoDescription } from '../../components/ContactInformation';

describe('Veteran information review content', () => {
  it('should render contact information', () => {
    const data = {
      veteran: {
        email: 'someone@famous.com',
        phone: {
          areaCode: '555',
          phoneNumber: '8001212',
          extension: '1234',
        },
        address: {
          addressType: ADDRESS_TYPES.domestic,
          countryName: 'United States',
          countryCodeIso3: 'USA',
          addressLine1: '123 Main Blvd',
          addressLine2: 'Floor 33',
          addressLine3: 'Suite 55',
          city: 'Hollywood',
          stateCode: 'CA',
          zipCode: '90210',
        },
      },
    };
    const ContactInfo = () => <>{ContactInfoDescription(data)}</>;
    const tree = shallow(<ContactInfo />);
    const address = tree.find('.blue-bar-block');
    const text = address.text();

    expect(address).to.have.lengthOf(1);
    expect(
      address
        .find('Telephone')
        .dive()
        .text(),
    ).to.contain('555-800-1212');
    expect(text).to.contain('someone@famous.com');
    expect(text).to.contain('123 Main Blvd');
    expect(text).to.contain('Floor 33');
    expect(text).to.contain('Suite 55');
    expect(text).to.contain('Hollywood, CA 90210');
    tree.unmount();
  });
});
