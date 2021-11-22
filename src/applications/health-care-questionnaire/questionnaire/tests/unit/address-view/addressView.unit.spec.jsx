import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AddressView from '../../../components/veteran-info/AddressView';

describe('health care questionnaire - display an address', () => {
  it('full address -- address1, address2 and address3', () => {
    const data = {
      addressLine1: 'line 1',
      addressLine2: 'line 2',
      addressLine3: 'line 3',
      city: 'Remote',
      stateCode: 'Or',
      zipCode: '12345',
    };
    const addressView = mount(<AddressView address={data} />);
    expect(addressView.find('span.address').text()).to.equal(
      'line 1 line 2 line 3',
    );
    expect(addressView.find('span.city-state-zip').text()).to.equal(
      'Remote, Or 12345',
    );
    addressView.unmount();
  });
  it('only address 1', () => {
    const data = {
      addressLine1: 'line 1',
      addressLine2: '',
      addressLine3: '',
      city: 'Remote',
      stateCode: 'Or',
      zipCode: '12345',
    };
    const addressView = mount(<AddressView address={data} />);
    expect(addressView.find('span.address').text()).to.equal('line 1');
    expect(addressView.find('span.city-state-zip').text()).to.equal(
      'Remote, Or 12345',
    );
    addressView.unmount();
  });
});
