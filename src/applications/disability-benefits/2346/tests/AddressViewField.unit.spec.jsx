import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import AddressViewField from '../components/AddressViewField';

const baseData = {
  city: 'city',
};

describe('AddressViewField', () => {
  it('should render all USA fields', () => {
    const formData = {
      ...baseData,
      street: 's1',
      street2: 's2',
      postalCode: '12345',
      country: 'United States',
      state: 'state',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<div class="vads-u-border-left--7px vads-u-border-color--primary"><p class="vads-u-margin-left--2 vads-u-margin-top--0 dd-privacy-mask">s1<br/>s2<br/>city, state 12345<span class="vads-u-display--block">United States</span></p></div>',
    );
    wrapper.unmount();
  });
  it('should display copy if USA fields are undefined for any address type', () => {
    const formData = {
      ...baseData,
      street: undefined,
      street2: undefined,
      postalCode: undefined,
      country: undefined,
      city: undefined,
      state: undefined,
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<p>Please provide a temporary address if you want us to ship your order to another location, like a relative’s house or a vacation home.</p>',
    );
    wrapper.unmount();
  });
  it('should display copy if non-USA fields are undefined for any address type', () => {
    const formData = {
      street: undefined,
      street2: undefined,
      internationalPostalCode: undefined,
      country: undefined,
      city: undefined,
      province: undefined,
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<p>Please provide a temporary address if you want us to ship your order to another location, like a relative’s house or a vacation home.</p>',
    );
    wrapper.unmount();
  });

  it('should render all non-USA fields', () => {
    const formData = {
      ...baseData,
      country: 'Canada',
      street: 's1',
      street2: 's2',
      internationalPostalCode: '123456789',
      province: 'p1',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<div class="vads-u-border-left--7px vads-u-border-color--primary"><p class="vads-u-margin-left--2 vads-u-margin-top--0 dd-privacy-mask">s1<br/>s2<br/>city, p1 123456789<span class="vads-u-display--block">Canada</span></p></div>',
    );
    wrapper.unmount();
  });
});
