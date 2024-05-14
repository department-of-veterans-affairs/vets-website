import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import SupportingFilesDescription from '../../components/SupportingFilesDescription';

describe('Pre-need SupportingFilesCollapsibleList component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<SupportingFilesDescription />);
  });

  it('renders and unmounts without crashing', () => {
    expect(wrapper.exists()).to.be.true;
    wrapper.unmount();
    expect(wrapper.exists()).to.be.false;
  });

  it('renders collapsible list', () => {
    expect(wrapper.find('CollapsibleList').exists()).to.be.true;
    wrapper.unmount();
  });
});
