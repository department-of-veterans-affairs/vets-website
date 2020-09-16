import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ToolTip from '../../components/ToolTip';

describe('<ToolTip>', () => {
  it('should render', () => {
    const wrapper = mount(
      <ToolTip id="1" text="text" className="search-result">
        <div id="child">test</div>
      </ToolTip>,
    );
    const vdom = wrapper.html();
    expect(vdom).to.not.be.undefined;
    expect(wrapper.find('#child')).to.have.lengthOf(1);
    expect(wrapper.find('.tooltip-text').html()).to.contain('text');
    wrapper.unmount();
  });

  it('should set id', () => {
    const wrapper = mount(
      <ToolTip id="1" text="text" className="search-result">
        <div id="child">test</div>
      </ToolTip>,
    );
    expect(wrapper.find('#1')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should set add className', () => {
    const wrapper = mount(
      <ToolTip id="1" text="text" className="search-result">
        <div id="child">test</div>
      </ToolTip>,
    );
    expect(wrapper.find('.search-result')).to.have.lengthOf(1);
    wrapper.unmount();
  });

  it('should remove tooltip class when disabled', () => {
    const wrapper = mount(
      <ToolTip id="1" text="text" className="search-result" disabled>
        <div id="child">test</div>
      </ToolTip>,
    );
    expect(wrapper.find('.tooltip')).to.have.lengthOf(0);
    wrapper.unmount();
  });

  it('should not render span or add tooltip class when text is not present', () => {
    const wrapper = mount(
      <ToolTip id="1" className="search-result">
        <div id="child">test</div>
      </ToolTip>,
    );
    expect(wrapper.find('.tooltip')).to.have.lengthOf(0);
    expect(wrapper.find('.tooltip-text')).to.have.lengthOf(0);
    wrapper.unmount();
  });
});
