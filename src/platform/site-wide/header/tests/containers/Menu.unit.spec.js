import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Menu } from '../../containers/Menu';

describe('Header <Menu>', () => {
  it('does not render when isMenuOpen is falsey', () => {
    const wrapper = shallow(<Menu />);

    expect(wrapper.isEmptyRender()).to.equal(true);

    wrapper.unmount();
  });

  it('renders SubMenu when subMenu is truthy', () => {
    const wrapper = shallow(<Menu isMenuOpen subMenu />);

    expect(wrapper.find('Connect(SubMenu)')).to.have.length(1);

    wrapper.unmount();
  });

  it('renders nav without megamenu data when isMenuOpen is truthy', () => {
    const wrapper = shallow(<Menu isMenuOpen />);

    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(0);

    wrapper.unmount();
  });

  it('renders nav with megamenu data when subMenu and showMegaMenu is truthy', () => {
    const wrapper = shallow(<Menu isMenuOpen showMegaMenu />);

    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(1);
    expect(wrapper.find('Connect(MenuItemLevel1)')).to.have.length(1);

    wrapper.unmount();
  });

  it('renders nav with megamenu data when subMenu and showMegaMenu is truthy and megaMenuData is populated', () => {
    const megaMenuData = [
      {
        href: 'https://staging.va.gov/find-locations',
        title: 'Find a VA Location',
      },
    ];

    const wrapper = shallow(
      <Menu isMenuOpen showMegaMenu megaMenuData={megaMenuData} />,
    );

    expect(wrapper.find('Connect(SubMenu)')).to.have.length(0);
    expect(
      wrapper.find('div.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(wrapper.find('Search')).to.exist;
    expect(wrapper.find('ul')).to.have.length(1);
    expect(wrapper.find('Connect(MenuItemLevel1)')).to.have.length(2);

    wrapper.unmount();
  });
});
