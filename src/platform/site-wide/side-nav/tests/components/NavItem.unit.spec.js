// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import NavItem from '../../components/NavItem';

describe('<NavItem>', () => {
  it('should always render when used.', () => {
    const wrapper = shallow(<NavItem />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });

  it('should render child nav items when it has children and it is expanded.', () => {
    const noop = () => {};

    const item = {
      description: 'Some description',
      expanded: true,
      hasChildren: true,
      href: '/pittsburgh-health-care',
      id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
      isSelected: true,
      label: 'Location',
      order: 0,
      parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
    };

    const defaultProps = {
      depth: 2,
      item,
      index: 1,
      renderChildItems: noop,
      sortedNavItems: [item],
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItem {...defaultProps} />);
    expect(wrapper.contains(<ul />)).to.equal(true);
    wrapper.unmount();
  });

  it('should render the ending line when nav item is first level and not the last nav item.', () => {
    const noop = () => {};

    const item = {
      description: 'Some description',
      expanded: true,
      hasChildren: true,
      href: '/pittsburgh-health-care',
      id: '00c9a1ff-3550-4f54-9239-c769fc6werwerwe',
      isSelected: true,
      label: 'Location',
      order: 0,
      parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d23423',
    };

    const lastItem = {
      description: 'Some description',
      expanded: true,
      hasChildren: true,
      href: '/pittsburgh-health-care',
      id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
      isSelected: true,
      label: 'Location',
      order: 1,
      parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
    };

    const defaultProps = {
      depth: 1,
      item,
      index: 0,
      renderChildItems: noop,
      sortedNavItems: [item, lastItem],
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItem {...defaultProps} />);
    expect(wrapper.contains(<div className="line" />)).to.equal(true);
    wrapper.unmount();
  });
});
