import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import VAPServiceEditModalErrorMessage from '../../components/base/VAPServiceEditModalErrorMessage';

describe('<VAPServiceEditModalErrorMessage />', () => {
  it('shows the correct error message when there is an invalid email', () => {
    const invalidEmailError = {
      errors: [
        {
          title: 'Check Email Address',
          detail:
            "Email address cannot have 2 @ symbols, must have at least one period '.' after the @ character, and cannot have '.%' or '%.' or '%..%' or \" ( ) , : ; < > @ [ ] or space unless in a quoted string in the local part.",
          code: 'VET360_EMAIL305',
          source: 'Vet360::ContactInformation::Service',
          status: '400',
        },
      ],
    };
    const wrapper = mount(
      <VAPServiceEditModalErrorMessage error={invalidEmailError} />,
    );
    expect(wrapper.find('va-alert')).to.have.lengthOf(1);
    expect(wrapper.html()).to.include(
      'It looks like the email you entered isn’t valid. Please enter your email address again.',
    );
    wrapper.unmount();
  });
  it('shows the correct error message when there is an invalid phone area code', () => {
    const invalidPhoneError = {
      errors: [
        {
          title: 'Area Code Pattern',
          detail: 'Phone area code pattern must match "[0-9]+"',
          code: 'VET360_PHON126',
          source: 'Vet360::ContactInformation::Service',
          status: '400',
        },
      ],
    };
    const wrapper = mount(
      <VAPServiceEditModalErrorMessage error={invalidPhoneError} />,
    );
    expect(wrapper.find('va-alert')).to.have.lengthOf(1);
    expect(wrapper.html()).to.include(
      'currently only support U.S. area codes. Please provide a U.S.-based',
    );
    wrapper.unmount();
  });
});
