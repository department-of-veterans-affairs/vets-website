// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
// Relative
import SideNav from '../../components/SideNav';

describe('<SideNav>', () => {
  const defaultProps = {
    navItemsLookup: {
      '00c9a1ff-3550-4f54-9239-c769fc6edab1': {
        description: 'Some description',
        expanded: false,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: '00c9a1ff-3550-4f54-9239-c769fc6edab1',
        label: 'Location',
        order: 0,
        parentID: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
      },
      '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e': {
        description: 'Some description',
        expanded: false,
        hasChildren: false,
        href: '/pittsburgh-health-care/location',
        id: '8e5668a6-90d9-4913-bc9f-c8f6788d7a2e',
        label: 'Pittsburgh Health Care',
        order: 0,
        parentID: undefined,
      },
    },
  };

  const oldWindow = global.window;

  beforeEach(() => {
    global.window = {
      location: {
        pathname: '/',
      },
    };
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should not render when there are no nav items to show', () => {
    const wrapper = shallow(<SideNav />);
    expect(wrapper.find('SideNav').length).to.equal(0);
    wrapper.unmount();
  });

  it('should render when there are nav items', () => {
    const wrapper = shallow(<SideNav {...defaultProps} />);
    expect(wrapper.find('SideNav').length).to.equal(1);
    wrapper.unmount();
  });
});
