import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MailingAddressViewField from '../../components/MailingAddressViewField';

describe('MailingAddressViewField component', () => {
  const initialState = {
    address: {
      street: '123 true st',
      street2: '#1',
      city: 'Fairfax',
      state: 'VA',
      postalCode: '22042',
    },
  };

  it('should render the mailing address', () => {
    const wrapper = mount(<MailingAddressViewField formData={initialState} />);
    expect(wrapper.text()).to.include('123 true st');
    expect(wrapper.text()).to.include('#1');
    expect(wrapper.text()).to.include('Fairfax');
    expect(wrapper.text()).to.include('VA');
    expect(wrapper.text()).to.include('22042');
    wrapper.unmount();
  });
});
