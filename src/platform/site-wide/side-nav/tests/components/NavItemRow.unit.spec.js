// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import NavItemRow from '../../components/NavItemRow';

describe('<NavItemRow>', () => {
  it('should render a button tag when there are child nav items.', () => {
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
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItemRow {...defaultProps} />);
    expect(wrapper.exists('button')).to.equal(true);
    expect(wrapper.exists('a')).to.equal(false);
    wrapper.unmount();
  });

  it('should render an anchor tag when there are child nav items.', () => {
    const noop = () => {};

    const item = {
      description: 'Some description',
      expanded: true,
      hasChildren: false,
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
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItemRow {...defaultProps} />);
    expect(wrapper.exists('button')).to.equal(false);
    expect(wrapper.exists('a')).to.equal(true);
    wrapper.unmount();
  });
});
