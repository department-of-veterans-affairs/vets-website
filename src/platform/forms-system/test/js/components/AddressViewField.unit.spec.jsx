import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

const baseData = {
  city: 'city',
  state: 'state',
  country: 'USA',
};

describe('AddressViewField', () => {
  it('should render all USA fields', () => {
    const formData = {
      ...baseData,
      street: 's1',
      line2: 's2',
      line3: 's3',
      postalCode: '12345',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<p>s1<br/>s2<br/>s3<br/>city, state 12345</p>',
    );
    wrapper.unmount();
  });
  it('should render all alternative USA fields', () => {
    const formData = {
      ...baseData,
      addressLine1: 's1',
      addressLine2: 's2',
      addressLine3: 's3',
      zipCode: '123456789',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal(
      '<p>s1<br/>s2<br/>s3<br/>city, state 12345-6789</p>',
    );
    wrapper.unmount();
  });
  it('should skip undefined USA fields', () => {
    const wrapper = shallow(<AddressViewField formData={baseData} />);
    expect(wrapper.html()).to.equal('<p>city, state </p>');
    wrapper.unmount();
  });

  it('should render all non-USA fields (skip postal code)', () => {
    const formData = {
      ...baseData,
      country: 'zland',
      street: 's1',
      line2: 's2',
      postalCode: '123456789',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal('<p>s1<br/>s2<br/>city, zland</p>');
    wrapper.unmount();
  });
  it('should skip undefined non-USA fields', () => {
    const formData = {
      ...baseData,
      country: 'zland',
    };
    const wrapper = shallow(<AddressViewField formData={formData} />);
    expect(wrapper.html()).to.equal('<p>city, zland</p>');
    wrapper.unmount();
  });
});
