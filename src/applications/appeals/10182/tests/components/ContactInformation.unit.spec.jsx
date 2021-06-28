import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

import { ContactInfoDescription } from '../../components/ContactInformation';

const getData = ({
  email = true,
  mobile = true,
  home = false,
  address = true,
  refreshProfile = () => {},
  submitted = false,
} = {}) => {
  const data = {};
  if (email) {
    data.email = {
      emailAddress: 'someone@famous.com',
    };
  }
  if (mobile || home) {
    const type = mobile ? 'mobile' : 'home';
    data[`${type}Phone`] = {
      phoneType: type,
      areaCode: '555',
      phoneNumber: '8001212',
      extension: '1234',
    };
  }
  if (address) {
    data.mailingAddress = {
      addressType: ADDRESS_TYPES.domestic,
      countryName: 'United States',
      countryCodeIso3: 'USA',
      addressLine1: '123 Main Blvd',
      addressLine2: 'Floor 33',
      addressLine3: 'Suite 55',
      city: 'Hollywood',
      stateCode: 'CA',
      zipCode: '90210',
    };
  }
  return {
    formContext: { submitted },
    profile: { vapContactInfo: data },
    refreshProfile,
  };
};

describe('Veteran information review content', () => {
  it('should render contact information', () => {
    const data = getData();
    const tree = shallow(<ContactInfoDescription {...data} />);
    const address = tree.find('.blue-bar-block');
    const text = address.text();

    expect(address).to.have.lengthOf(1);
    expect(address.find('Telephone').props().contact).to.contain('5558001212');
    expect(text).to.contain('someone@famous.com');
    expect(text).to.contain('123 Main Blvd');
    expect(text).to.contain('Floor 33');
    expect(text).to.contain('Suite 55');
    expect(text).to.contain('Hollywood, CA 90210');
    tree.unmount();
  });
  it('should fall back to home phone if mobile is missing', () => {
    const data = getData({ mobile: false, home: true });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const address = tree.find('.blue-bar-block');
    const text = address.text();

    expect(address).to.have.lengthOf(1);
    expect(address.find('Telephone').props().contact).to.contain('5558001212');
    expect(text).to.contain('someone@famous.com');
    expect(text).to.contain('123 Main Blvd');
    expect(text).to.contain('Floor 33');
    expect(text).to.contain('Suite 55');
    expect(text).to.contain('Hollywood, CA 90210');
    tree.unmount();
  });

  it('should render note about missing phone', () => {
    const data = getData({ mobile: false });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const text = tree.find('va-alert').text();

    expect(text).to.contain('Your phone is missing');
    tree.unmount();
  });
  it('should render note about missing email & phone', () => {
    const data = getData({ mobile: false, email: false });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const text = tree.find('va-alert').text();

    expect(text).to.contain('Your email and phone are missing');
    tree.unmount();
  });
  it('should render note about missing email, phone & address', () => {
    const data = getData({ mobile: false, email: false, address: false });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const text = tree.find('va-alert').text();

    expect(text).to.contain('Your email, phone and address are missing');
    tree.unmount();
  });
  it('should render an error if updated button is clicked without actually updating', () => {
    const refreshProfile = sinon.spy();
    const data = getData({
      refreshProfile,
      submitted: false,
      email: false,
    });
    const tree = mount(<ContactInfoDescription {...data} />);
    const alert = tree.find('va-alert');

    expect(alert.props().status).to.eq('warning');
    expect(alert.text()).to.contain('Your email is missing');

    // simulate clicking on "My contact details have been updated" button
    alert
      .find('button')
      .props()
      .onClick({ preventDefault: () => {} });

    tree.setProps(data);
    expect(refreshProfile.called).to.be.true;

    const alerts = tree.find('va-alert');
    expect(alerts.length).to.eq(2);
    expect(alerts.at(0).props().status).to.eq('error');
    expect(alerts.at(1).props().status).to.eq('warning');

    tree.unmount();
  });
  it('should render note about missing address & show success after updating', () => {
    const refreshProfile = sinon.spy();
    const data = getData({
      refreshProfile,
      submitted: false,
      email: false,
    });
    const tree = mount(<ContactInfoDescription {...data} />);
    const alert = tree.find('va-alert');

    expect(alert.props().status).to.eq('warning');
    expect(alert.text()).to.contain('Your email is missing');

    // simulate clicking on "My contact details have been updated" button
    alert
      .find('button')
      .props()
      .onClick({ preventDefault: () => {} });
    tree.setProps(getData({ refreshProfile }));
    expect(refreshProfile.called).to.be.true;

    const success = tree.find('va-alert');
    expect(success.length).to.eq(1);
    expect(success.props().status).to.eq('success');

    tree.unmount();
  });
});
