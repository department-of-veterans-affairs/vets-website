import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import PrintButton from '../../../questionnaire-list/components/Shared/Print/PrintButton';

describe('health care questionnaire list - shows view and print button', () => {
  it('renders, no error message', () => {
    const component = mount(<PrintButton />);
    expect(component.exists('.va-button')).to.be.true;
    component.unmount();
  });

  it('renders error message after click', () => {
    const component = mount(<PrintButton />);
    expect(component.exists('.va-button')).to.be.true;
    component
      .find('.va-button')
      .at(0)
      .simulate('click');
    expect(component.exists('.va-button')).to.be.false;
    expect(component.exists('[data-testid="service-down-message"]')).to.be.true;
    component.unmount();
  });
});
