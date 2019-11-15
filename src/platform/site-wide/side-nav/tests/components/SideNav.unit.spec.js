// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
// Relative
import SideNav from '../../components/SideNav';

describe('<SideNav>', () => {
  const firstID = uniqueId('sidenav_');
  const secondID = uniqueId('sidenav_');

  const defaultProps = {
    navItemsLookup: {
      [firstID]: {
        description: 'Some description',
        expanded: false,
        hasChildren: true,
        href: '/pittsburgh-health-care',
        id: firstID,
        label: 'Location',
        order: 0,
        parentID: uniqueId('sidenav_'),
      },
      [secondID]: {
        description: 'Some description',
        expanded: false,
        hasChildren: false,
        href: '/pittsburgh-health-care/location',
        id: secondID,
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
    expect(wrapper.type()).to.equal(null);
    wrapper.unmount();
  });

  it('should render when there are nav items', () => {
    const wrapper = shallow(<SideNav {...defaultProps} />);
    expect(wrapper.type()).to.not.equal(null);
    wrapper.unmount();
  });
});
