import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PhoneNumberView from '../../../components/veteran-info/PhoneNumberView';

describe('health care questionnaire - display a phone number', () => {
  it('valid phone number - should return formatted', () => {
    const data = {
      label: 'my-label',
      data: {
        areaCode: '123',
        phoneNumber: '8675309',
      },
    };
    const phoneNumber = mount(<PhoneNumberView number={data} />);
    expect(phoneNumber.find('[data-testid="my-labelPhone"]').text()).to.equal(
      '123-867-5309',
    );
    phoneNumber.unmount();
  });
  it('invalid phone number - not enough digits', () => {
    const data = {
      label: 'my-label',
      data: {
        areaCode: '123',
        phoneNumber: '8675',
      },
    };
    const phoneNumber = mount(<PhoneNumberView number={data} />);
    expect(phoneNumber.children()).to.have.lengthOf(0);
    phoneNumber.unmount();
  });
});
