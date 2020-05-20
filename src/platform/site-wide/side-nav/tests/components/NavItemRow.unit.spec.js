// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
// Relative
import NavItemRow from '../../components/NavItemRow';

describe('<NavItemRow>', () => {
  it('should render a hyperlink tag only when there are child nav items.', () => {
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
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItemRow {...defaultProps} />);
    expect(wrapper.exists('a')).to.equal(true);
    wrapper.unmount();
  });

  it('should render a hyperlink tag when there are not child nav items.', () => {
    const noop = () => {};

    const item = {
      description: 'Some description',
      expanded: true,
      hasChildren: false,
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
      toggleItemExpanded: noop,
    };

    const wrapper = shallow(<NavItemRow {...defaultProps} />);
    expect(wrapper.exists('a')).to.equal(true);
    wrapper.unmount();
  });
});
