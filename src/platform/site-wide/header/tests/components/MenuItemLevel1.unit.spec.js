import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { MenuItemLevel1 } from '../../components/MenuItemLevel1';

describe('Header <MenuItemLevel1>', () => {
  it('renders an item with no children', () => {
    const item = { href: 'https://example.com', title: 'example' };
    const wrapper = shallow(<MenuItemLevel1 item={item} />);

    expect(
      wrapper.find('li.vads-u-background-color--primary-dark'),
    ).to.have.length(1);
    expect(wrapper.find('a[href="https://example.com"]')).to.have.length(1);
    expect(wrapper.find('a').text()).to.equal('example');
    expect(wrapper.find('.header-menu-item-button')).to.have.length(0);

    wrapper.unmount();
  });

  it('renders an expanded item with children and collapses it on click', () => {
    const updateExpandedMenuID = sinon.spy();
    const item = {
      menuSections: [{ title: 'random title', href: 'https://example.com' }],
      title: 'example',
    };

    const wrapper = shallow(
      <MenuItemLevel1
        expandedMenuID="example--1"
        item={item}
        updateExpandedMenuID={updateExpandedMenuID}
      />,
    );

    expect(
      wrapper.find('li.vads-u-background-color--primary-dark'),
    ).to.have.length(1);
    expect(wrapper.find('a')).to.have.length(0);
    expect(wrapper.find('.header-menu-item-button')).to.have.length(1);
    expect(wrapper.find('.header-menu-item-button').text()).to.equal('example');
    expect(wrapper.find('ul')).to.have.length(1);

    wrapper.find('.header-menu-item-button').simulate('click');

    expect(updateExpandedMenuID.firstCall.args[0]).to.equal(undefined);

    wrapper.unmount();
  });

  it('renders a collapsed item with children and expands it on click', () => {
    const updateExpandedMenuID = sinon.spy();
    const item = {
      menuSections: [{ title: 'random title', href: 'https://example.com' }],
      title: 'example',
    };

    const wrapper = shallow(
      <MenuItemLevel1
        expandedMenuID="some-other-expanded-menu--1"
        item={item}
        updateExpandedMenuID={updateExpandedMenuID}
      />,
    );

    expect(
      wrapper.find('li.vads-u-background-color--primary-dark'),
    ).to.have.length(1);
    expect(wrapper.find('a')).to.have.length(0);
    expect(wrapper.find('.header-menu-item-button')).to.have.length(1);
    expect(wrapper.find('.header-menu-item-button').text()).to.equal('example');
    expect(wrapper.find('ul')).to.have.length(0);

    wrapper.find('.header-menu-item-button').simulate('click');

    expect(updateExpandedMenuID.firstCall.args[0]).to.equal('example--1');

    wrapper.unmount();
  });
});
