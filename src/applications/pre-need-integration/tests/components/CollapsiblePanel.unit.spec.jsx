import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import CollapsiblePanel from '../../components/CollapsiblePanel';

describe('CollapsiblePanel in Pre-need Supporting files', () => {
  const dummyHeader = <p>test content</p>;
  const props = {
    header: 'testHeader',
    pageContent: dummyHeader,
  };

  it('should render', () => {
    const wrapper = mount(<CollapsiblePanel {...props} />);
    expect(wrapper.find('button').length).to.equal(1);
    wrapper.unmount();
  });

  it('should expand collapsable panel when clicked', () => {
    const wrapper = mount(<CollapsiblePanel {...props} />);

    let expandedContent = wrapper.find(`#collapsible-${props.header}`);
    expect(expandedContent.exists()).to.be.false;

    const button = wrapper.find('#collapsibleButton3');
    button.simulate('click');

    expandedContent = wrapper.find(`#collapsible-${props.header}`);
    expect(expandedContent.exists()).to.be.true;
    wrapper.unmount();
  });

  it('should have expanded content when clicked', () => {
    const wrapper = mount(<CollapsiblePanel {...props} />);
    const button = wrapper.find('#collapsibleButton3');
    button.simulate('click');

    const expandedContent = wrapper.find(`#collapsible-${props.header}`);
    expect(expandedContent.at(0).text()).to.equal('test content');
    wrapper.unmount();
  });

  it('should have default expanded content when clicked', () => {
    const wrapper = mount(<CollapsiblePanel />);
    const button = wrapper.find('#collapsibleButton3');
    button.simulate('click');

    const expandedContent = wrapper.find('#collapsible-3');
    expect(expandedContent.at(0).text()).to.equal('');
    wrapper.unmount();
  });
});
