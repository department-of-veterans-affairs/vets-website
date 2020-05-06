// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
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
      id: uniqueId('sidenav_'),
      isSelected: true,
      label: 'Location',
      order: 0,
      parentID: uniqueId('sidenav_'),
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
});
