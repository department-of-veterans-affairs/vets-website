import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PhoneViewField from '../../components/PhoneViewField';

describe('PhoneViewField component', () => {
  it('renders the PhoneViewField footer', () => {
    const formData = {
      phone: '3333333333',
    };
    const wrapper = mount(<PhoneViewField formData={formData} />);
    expect(wrapper.text()).to.include('333-333-3333');

    wrapper.unmount();
  });
});
