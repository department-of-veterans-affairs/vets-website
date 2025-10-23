import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ViewDependentsSidebarBlock from '../../components/ViewDependentsSidebar/ViewDependentsSidebarBlock';

describe('<ViewDependentsSidebar />', () => {
  it('should render', () => {
    const mockHeader = 'Here is the header';
    const mockContent = <div>Here is the content</div>;
    const wrapper = shallow(
      <ViewDependentsSidebarBlock heading={mockHeader} content={mockContent} />,
    );
    expect(wrapper.find('div.vads-u-padding-bottom--1p5')).to.exist;
    wrapper.unmount();
  });
});
