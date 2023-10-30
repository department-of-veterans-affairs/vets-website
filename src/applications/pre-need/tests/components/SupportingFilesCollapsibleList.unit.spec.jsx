import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SupportingFilesCollapsibleList from '../../components/SupportingFilesCollapsibleList';

describe('Pre-need SupportingFilesCollapsibleList component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<SupportingFilesCollapsibleList />);
  });

  it('renders and unmounts without crashing', () => {
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('should render a collapsible list', () => {
    const collapsibleList = wrapper.find('CollapsibleList');
    expect(collapsibleList.exists()).to.be.true;
    wrapper.unmount();
  });

  it('the collapsible list renders collapsible panels', () => {
    const collapsiblePanels = wrapper.find('CollapsiblePanel');
    expect(collapsiblePanels).to.have.length(3);
    wrapper.unmount();
  });

  it('each collapsible panel should expand when clicked', () => {
    const panels = wrapper.find('CollapsiblePanel');
    expect(wrapper.find('#collapsible-3').exists()).to.be.false;
    panels.forEach(panel => {
      const button = panel.find('#collapsibleButton3');
      button.simulate('click');
    });
    expect(wrapper.find('#collapsible-3').exists()).to.be.true;
    expect(wrapper.find('#collapsible-3')).to.have.length(3);
    wrapper.unmount();
  });
});
