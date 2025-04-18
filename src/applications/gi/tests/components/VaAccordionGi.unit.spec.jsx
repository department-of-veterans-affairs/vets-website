import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { VaAccordionItem } from '@department-of-veterans-affairs/web-components/react-bindings';
import VaAccordionGi from '../../components/VaAccordionGi';

describe('<VaAccordionGi>', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<VaAccordionGi title="Test Title" />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render the correct title', () => {
    const title = 'Test Accordion';
    const wrapper = shallow(<VaAccordionGi title={title} />);
    expect(wrapper.find('h2').text()).to.equal(title);
    wrapper.unmount();
  });

  it('should render children correctly', () => {
    const wrapper = shallow(
      <VaAccordionGi title="Test">
        <p className="child-content">Accordion Content</p>
      </VaAccordionGi>,
    );

    expect(wrapper.find('.child-content').text()).to.equal('Accordion Content');
    wrapper.unmount();
  });

  it('should set the expanded prop correctly', () => {
    const wrapper = shallow(<VaAccordionGi title="Test" expanded />);
    expect(wrapper.find(VaAccordionItem).prop('open')).to.equal(true);
    wrapper.unmount();
  });

  it('should call onChange when the accordion item is clicked', () => {
    const onChangeSpy = sinon.spy();
    const wrapper = shallow(
      <VaAccordionGi title="Test" expanded={false} onChange={onChangeSpy} />,
    );

    // Simulate click event on VaAccordionItem
    wrapper
      .find(VaAccordionItem)
      .simulate('click', { target: { tagName: 'VA-ACCORDION-ITEM' } });

    expect(onChangeSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should NOT call onChange when a nested element inside VaAccordionItem is clicked', () => {
    const onChangeSpy = sinon.spy();
    const wrapper = shallow(
      <VaAccordionGi title="Test" expanded={false} onChange={onChangeSpy}>
        <button className="nested-btn">Click Me</button>
      </VaAccordionGi>,
    );

    // Simulate clicking inside the accordion but not on the main item
    wrapper
      .find('.nested-btn')
      .simulate('click', { target: { tagName: 'BUTTON' } });

    expect(onChangeSpy.called).to.be.false;
    wrapper.unmount();
  });
});
