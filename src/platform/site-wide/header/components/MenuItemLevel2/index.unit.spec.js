// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { MenuItemLevel2 } from '.';

describe('Header <MenuItemLevel2>', () => {
  it('renders an item with no children', () => {
    // Set up.
    const item = { href: 'https://example.com', title: 'example' };
    const wrapper = shallow(<MenuItemLevel2 item={item} />);

    // Assertions.
    expect(
      wrapper.find('li.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('a[href="https://example.com"]')).to.have.length(1);
    expect(wrapper.find('a').text()).to.equal('example');
    expect(wrapper.find('.header-menu-item-button')).to.have.length(0);
    expect(wrapper.find('i.fa.fa-chevron-right')).to.have.length(0);

    // Clean up.
    wrapper.unmount();
  });

  it('renders an item and updates the sub menu on click', () => {
    // Set up.
    const updateSubMenu = sinon.spy();
    const item = {
      links: [{ text: 'random title', href: 'https://example.com' }],
      title: 'example',
    };
    const wrapper = shallow(
      <MenuItemLevel2 item={item} updateSubMenu={updateSubMenu} />,
    );

    // Assertions.
    expect(
      wrapper.find('li.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('a')).to.have.length(0);
    expect(wrapper.find('.header-menu-item-button')).to.have.length(1);
    expect(wrapper.find('.header-menu-item-button').text()).to.equal('example');
    expect(wrapper.find('i.fa.fa-chevron-right')).to.have.length(1);

    // Set up.
    wrapper.find('.header-menu-item-button').simulate('click');

    // Assertions.
    expect(updateSubMenu.firstCall.args[0]).to.deep.equal({
      id: 'example--2',
      menuSections: [{ text: 'random title', href: 'https://example.com' }],
    });

    // Clean up.
    wrapper.unmount();
  });
});
