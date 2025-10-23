import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import DirectDepositViewField from '../../../components/DirectDepositViewField';

describe('render direct deposit view component', () => {
  it('should render bank information component wrapper text', () => {
    const initialState = {
      formData: {
        bankAccount: {
          accountType: 'Saving',
        },
      },
    };

    const wrapper = shallow(<DirectDepositViewField {...initialState} />);

    expect(wrapper.text()).to.include(
      'Your bank account information is what we currently have on file for you. Please ensure it is correct.',
    );
    wrapper.unmount();
  });
});
