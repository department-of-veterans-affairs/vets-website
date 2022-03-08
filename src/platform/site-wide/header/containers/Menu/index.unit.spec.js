// Node modules.
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { Menu } from '.';

describe('Header <Menu>', () => {
  it('does not render when isMenuOpen is falsey', () => {
    // Set up.
    const wrapper = shallow(<Menu />);

    // Assertions.
    expect(wrapper.isEmptyRender()).to.equal(true);

    // Clean up.
    wrapper.unmount();
  });

  it('renders SubMenu when subMenu is truthy', () => {
    // Set up.
    const wrapper = shallow(<Menu isMenuOpen subMenu />);

    // Assertions.
    expect(wrapper.find('Connect(SubMenu)')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });

  it('renders nav without megamenu data when subMenu is truthy', () => {
    // Set up.
    const wrapper = shallow(<Menu isMenuOpen />);

    // Assertions.
    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(0);

    // Clean up.
    wrapper.unmount();
  });

  it('renders nav with megamenu data when subMenu and showMegaMenu is truthy', () => {
    // Set up.
    const wrapper = shallow(<Menu isMenuOpen showMegaMenu />);

    // Assertions.
    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(1);
    expect(wrapper.find('Connect(MenuItemLevel1)')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });

  it('renders nav with megamenu data when subMenu and showMegaMenu is truthy and megaMenuData is populated', () => {
    // Set up.
    const megaMenuData = [
      {
        href: 'https://staging.va.gov/find-locations',
        title: 'Find a VA Location',
      },
    ];
    const wrapper = shallow(
      <Menu isMenuOpen showMegaMenu megaMenuData={megaMenuData} />,
    );

    // Assertions.
    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(1);
    expect(wrapper.find('Connect(MenuItemLevel1)')).to.have.length(2);

    // Clean up.
    wrapper.unmount();
  });
});
