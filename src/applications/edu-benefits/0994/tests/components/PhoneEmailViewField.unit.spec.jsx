import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { PhoneEmailViewField } from '../../../0994/components/PhoneEmailViewField';

const formData = {
  dayTimePhone: '1234567890',
  nightTimePhone: '4445551212',
  emailAddress: 'test2@test1.net',
};

describe('<PhoneEmailViewField>', () => {
  it('should render', () => {
    const component = mount(<PhoneEmailViewField formData={formData} />);

    const text = component.text();

    expect(text).to.contain('123-456-7890');
    expect(text).to.contain('444-555-1212');
    expect(text).to.contain(formData.emailAddress);

    component.unmount();
  });
});
