import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ContactInfoDescription } from '../../components/ContactInformation';

const getData = ({
  email = true,
  mobile = true,
  address = true,
  submitted = false,
  homeless = false,
  loopPages = false,
} = {}) => {
  const data = {};
  if (email) {
    data.email = {
      emailAddress: 'someone@famous.com',
    };
  }
  if (mobile) {
    data.mobilePhone = {
      areaCode: '555',
      phoneNumber: '8001212',
      extension: '1234',
    };
  }
  if (address) {
    data.mailingAddress = {
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
    homeless,
    loopPages,
  };
};

describe('Veteran information review content', () => {
  it('should render inline contact information', () => {
    const data = getData();
    const tree = shallow(<ContactInfoDescription {...data} />);

    expect(tree.find('PhoneField')).to.exist;
    expect(tree.find('EmailField')).to.exist;
    expect(tree.find('MailingAddress')).to.exist;
    tree.unmount();
  });

  it('should not throw JS error when contact info value is null', () => {
    const data = getData();
    data.profile.vapContactInfo = {
      mobilePhone: null,
      mailingAddress: null,
      email: null,
    };

    const tree = shallow(<ContactInfoDescription {...data} />);

    expect(tree.find('PhoneField')).to.exist;
    expect(tree.find('EmailField')).to.exist;
    expect(tree.find('MailingAddress')).to.exist;
    tree.unmount();
  });

  it('should render contact information main loop', () => {
    const data = getData({ loopPages: true });
    const tree = shallow(<ContactInfoDescription {...data} />);

    expect(tree.find('va-telephone')).to.exist;
    expect(tree.find('AddressView')).to.exist;
    expect(tree.find('Link').length).to.eq(3);

    expect(tree.find('PhoneField').length).to.eq(0);
    expect(tree.find('EmailField').length).to.eq(0);
    expect(tree.find('MailingAddress').length).to.eq(0);
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
  it('should render note about missing address if not homeless', () => {
    const data = getData({ email: false, address: false, homeless: false });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const text = tree.find('va-alert').text();

    expect(text).to.contain('Your email and address are missing');
    tree.unmount();
  });
  it('should should not include missing address if homeless', () => {
    const data = getData({ email: false, address: false, homeless: true });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const text = tree.find('va-alert').text();

    expect(text).to.contain('Your email is missing');
    tree.unmount();
  });

  it('should render an error if info is not actually updated', () => {
    const data = getData({
      submitted: false,
      email: false,
    });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const alert = tree.find('va-alert');

    expect(alert.props().status).to.eq('warning');
    expect(alert.text()).to.contain('Your email is missing');

    data.formContext.submitted = true;
    tree.setProps(data);

    const alerts = tree.find('va-alert');
    expect(alerts.length).to.eq(2);
    expect(alerts.at(0).props().status).to.eq('error');
    expect(alerts.at(1).props().status).to.eq('warning');

    tree.unmount();
  });
  // enzyme shallow doesn't call useEffect
  it.skip('should render note about missing address & show success after updating', () => {
    const data = getData({
      submitted: false,
      email: false,
    });
    const tree = shallow(<ContactInfoDescription {...data} />);
    const alert = tree.find('va-alert');

    expect(alert.props().status).to.eq('warning');
    expect(alert.text()).to.contain('Your email is missing');

    tree.setProps(getData());
    // should update & call useEffect here

    const success = tree.find('va-alert');
    expect(success.length).to.eq(1);
    expect(success.props().status).to.eq('success');

    tree.unmount();
  });
});
