import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import HelpdeskContact from '../components/HelpdeskContact';

describe('HelpdeskContact', () => {
  it('should render capitalized without children', () => {
    const wrapper = mount(<HelpdeskContact />);

    expect(
      wrapper
        .find('va-telephone')
        .at(0)
        .prop('contact'),
    ).to.equal('8006982411');
    expect(wrapper.text()).to.include(
      'Please call our MyVA411 main information line for help at',
    );
    wrapper.unmount();
  });
  it('should render lowercase with children', () => {
    const wrapper = mount(<HelpdeskContact>Test,</HelpdeskContact>);

    expect(
      wrapper
        .find('va-telephone')
        .at(1)
        .prop('contact'),
    ).to.equal('711');
    expect(wrapper.text()).to.include(
      'Test, please call our MyVA411 main information line for help at',
    );
    wrapper.unmount();
  });
});
