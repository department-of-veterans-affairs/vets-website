// Dependencies
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { uniqueId } from 'lodash';
// Relative
import NavItemRow from '../../components/NavItemRow';
import sinon from 'sinon';

describe('<NavItemRow>', () => {
  const trackEventsSpy = sinon.spy();

  const itemWithChildren = {
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

  const defaultProps = (item = itemWithChildren) => ({
    depth: 2,
    item,
    trackEvents: trackEventsSpy,
  });

  beforeEach(() => {
    trackEventsSpy.reset();
  });

  it('should fire trackEvents when href clicked', () => {
    const wrapper = shallow(<NavItemRow {...defaultProps()} />);
    expect(trackEventsSpy.called).to.equal(false);
    wrapper.find('a').simulate('click');
    expect(trackEventsSpy.calledOnce).to.equal(true);
    wrapper.unmount();
  });

  it('should render a hyperlink tag only when there are child nav items.', () => {
    const wrapper = shallow(<NavItemRow {...defaultProps()} />);
    expect(wrapper.exists('a')).to.equal(true);
    wrapper.unmount();
  });

  it('should render a hyperlink tag when there are not child nav items.', () => {
    const itemWithoutChildren = {
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

    const wrapper = shallow(
      <NavItemRow {...defaultProps(itemWithoutChildren)} />,
    );
    expect(wrapper.exists('a')).to.equal(true);
    wrapper.unmount();
  });

  it('renders pointerEvents none for current page', () => {
    window.location = { pathname: '/pittsburgh-health-care/' };

    const itemWithoutChildren = {
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

    const wrapper = shallow(
      <NavItemRow {...defaultProps(itemWithoutChildren)} />,
    );

    expect(wrapper.find('a').prop('style').pointerEvents).to.equal('none');
    wrapper.unmount();
  });

  it('renders pointerEvents all for non-current page', () => {
    window.location = { pathname: '/pittsburgh-health-care/' };

    const itemWithoutChildren = {
      description: 'Some description',
      expanded: true,
      hasChildren: false,
      href: '/pittsburgh-health-care/foo',
      id: uniqueId('sidenav_'),
      isSelected: true,
      label: 'Location',
      order: 0,
      parentID: uniqueId('sidenav_'),
    };

    const wrapper = shallow(
      <NavItemRow {...defaultProps(itemWithoutChildren)} />,
    );

    expect(wrapper.find('a').prop('style').pointerEvents).to.equal('all');
    wrapper.unmount();
  });
});
