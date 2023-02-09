import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import PhoneViewField from '../../../components/PhoneViewField';

describe('render phone view component with dashes', () => {
  it('should render phone number within Form Data', () => {
    const initialState = {
      formData: { phone: '1231231234' },
    };

    const wrapper = shallow(<PhoneViewField {...initialState} />);
    expect(wrapper.text()).to.include('123-123-1234');
    wrapper.unmount();
  });
});
