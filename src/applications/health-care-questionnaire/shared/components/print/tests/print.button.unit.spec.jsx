import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PrintButton from '../PrintButton';

describe('health care questionnaire list - shows view and print button - errors', () => {
  it('renders, no error message', () => {
    const component = mount(<PrintButton />);
    expect(component.exists('.va-button')).to.be.true;
    component.unmount();
  });
});
