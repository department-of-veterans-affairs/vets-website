import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import AccordionItem from '../../components/AccordionItem';

describe('<AccordionItem>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AccordionItem expanded button={'test'}>
        <div />
      </AccordionItem>,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should track accordion collapse', () => {
    const wrapper = mount(
      <AccordionItem expanded button={'test'}>
        <div />
      </AccordionItem>,
    );
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.eq('nav-accordion-collapse');
    wrapper.unmount();
  });

  it('should track accordion expand', () => {
    const wrapper = mount(
      <AccordionItem expanded={false} button={'test'}>
        <div />
      </AccordionItem>,
    );
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.eq('nav-accordion-expand');
    wrapper.unmount();
  });
});
