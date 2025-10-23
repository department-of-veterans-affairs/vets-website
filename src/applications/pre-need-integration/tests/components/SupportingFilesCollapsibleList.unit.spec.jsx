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
    const collapsibleList = wrapper.find('va-accordion');
    expect(collapsibleList.exists()).to.be.true;
    wrapper.unmount();
  });

  it('the collapsible list renders collapsible panels', () => {
    const collapsiblePanels = wrapper.find('va-accordion-item');
    expect(collapsiblePanels).to.have.length(3);
    wrapper.unmount();
  });
});
