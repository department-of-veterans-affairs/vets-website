import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import MailingAddressViewField from '../../../components/MailingAddressViewField';

describe('render mailing address view component', () => {
  it('should render mailing address within Form Data', () => {
    const initialState = {
      formData: {
        address: {
          country: 'United States of America',
          street: '123 Maple St',
          street2: 'Apt 2',
          city: 'Boston',
          state: 'MA',
          postalCode: '02108',
        },
      },
    };

    const wrapper = shallow(<MailingAddressViewField {...initialState} />);

    expect(wrapper.text()).to.include('United States of America');
    expect(wrapper.text()).to.include('123 Maple St');
    expect(wrapper.text()).to.include('Apt 2');
    expect(wrapper.text()).to.include('Boston');
    expect(wrapper.text()).to.include('MA');
    expect(wrapper.text()).to.include('02108');

    wrapper.unmount();
  });
});
