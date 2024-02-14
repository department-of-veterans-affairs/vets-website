import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AccordionItem from '../../components/AccordionItem';

describe('<AccordionItem>', () => {
  it('should render', () => {
    const wrapper = shallow(
      <AccordionItem expanded button="test">
        <div />
      </AccordionItem>,
    );
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('should track accordion collapse', () => {
    const wrapper = shallow(
      <AccordionItem expanded button="test">
        <div />
      </AccordionItem>,
    );

    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.eq('int-accordion-collapse');
    wrapper.unmount();
  });

  it('should track accordion expand', () => {
    const wrapper = shallow(
      <AccordionItem expanded={false} button="test">
        <div />
      </AccordionItem>,
    );
    wrapper
      .find('button')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.eq('int-accordion-expand');
    wrapper.unmount();
  });
  it('should show span with class section-button-span when is Prod ENV', () => {
    global.window.buildType = true;
    const wrapper = shallow(
      <AccordionItem expanded={false} button="test" section>
        <div />
      </AccordionItem>,
    );
    const span = wrapper
      .find('span.section-button-span')
      .at(0)
      .text();
    expect(span).to.eq('test');
    wrapper.unmount();
  });
  it('should show div with class section-content-expanded-width when expandedWidth is True', () => {
    const wrapper = shallow(
      <AccordionItem expanded={false} button="test" expandedWidth>
        <div />
      </AccordionItem>,
    );
    const div = wrapper
      .find('div.section-content-expanded-width')
      .at(0)
      .text();
    expect(div).to.exist;
    wrapper.unmount();
  });
  it('should show div with class section-content-expanded-width when expandedWidth is True', () => {
    const wrapper = shallow(
      <AccordionItem expanded={false} button="test" expandedWidth>
        <div />
      </AccordionItem>,
    );
    const div = wrapper
      .find('div.section-content-expanded-width')
      .at(0)
      .text();
    expect(div).to.exist;
    wrapper.unmount();
  });
  it('calls onClick when it is provided', () => {
    const onClickSpy = sinon.spy();
    const wrapper = shallow(
      <AccordionItem button="Test Button" onClick={onClickSpy} />,
    );

    wrapper.find('button').simulate('click');
    expect(onClickSpy).to.have.property('callCount', 1);
    expect(onClickSpy.calledWith(false)).to.equal(true);
    wrapper.unmount();
  });
});
