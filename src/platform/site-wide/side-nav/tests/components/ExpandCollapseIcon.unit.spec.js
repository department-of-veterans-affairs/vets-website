// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
// Relative
import ExpandCollapseIcon from '../../components/ExpandCollapseIcon';

describe('<ExpandCollapseIcon>', () => {
  it('should render null when the nav item does not have children', () => {
    const defaultProps = {
      depth: 3,
      item: {
        description: 'Some description',
        expanded: false,
        hasChildren: false,
        href: '/pittsburgh-health-care',
        id: uniqueId('sidenav_'),
        label: 'Location',
        order: 0,
        parentID: uniqueId('sidenav_'),
      },
    };

    const wrapper = shallow(<ExpandCollapseIcon {...defaultProps} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should render null when the nav item is not deeper than 2nd level', () => {
    const defaultProps = {
      depth: 1,
      item: {
        description: 'Some description',
        expanded: true,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: uniqueId('sidenav_'),
        label: 'Location',
        order: 0,
        parentID: uniqueId('sidenav_'),
      },
    };

    const wrapper = shallow(<ExpandCollapseIcon {...defaultProps} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should render when the nav item has children and is depeer than 2nd level', () => {
    const defaultProps = {
      depth: 3,
      item: {
        description: 'Some description',
        expanded: true,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: uniqueId('sidenav_'),
        label: 'Location',
        order: 0,
        parentID: uniqueId('sidenav_'),
      },
    };

    const wrapper = shallow(<ExpandCollapseIcon {...defaultProps} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
