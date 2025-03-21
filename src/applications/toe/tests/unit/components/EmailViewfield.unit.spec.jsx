import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import EmailViewField from '../../../components/EmailViewField';

describe('render email view component', () => {
  it('should render email address within Form Data', () => {
    const initialState = {
      formData: { email: 'test@test.com' },
    };

    const wrapper = shallow(<EmailViewField {...initialState} />);

    expect(wrapper.text()).to.include('test@test.com');
    wrapper.unmount();
  });
});
