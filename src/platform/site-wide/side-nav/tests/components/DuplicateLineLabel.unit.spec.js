// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import DuplicateLineLabel from '../../components/DuplicateLineLabel';

describe('<DuplicateLineLabel>', () => {
  it('should not render when the nav item is collapsed', () => {
    const defaultProps = {
      depth: 2,
      item: {
        description: 'Some description',
        expanded: false,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
        label: 'Location',
        order: 0,
        parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
      },
    };

    const wrapper = shallow(<DuplicateLineLabel {...defaultProps} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should not render when the nav item is not 2nd level', () => {
    const defaultProps = {
      depth: 3,
      item: {
        description: 'Some description',
        expanded: true,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
        label: 'Location',
        order: 0,
        parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
      },
    };

    const wrapper = shallow(<DuplicateLineLabel {...defaultProps} />);
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should render when the nav item is expanded and is 2nd level', () => {
    const defaultProps = {
      depth: 2,
      item: {
        description: 'Some description',
        expanded: true,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
        label: 'Location',
        order: 0,
        parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
      },
    };

    const wrapper = shallow(<DuplicateLineLabel {...defaultProps} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
