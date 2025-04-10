import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SubMenu } from '../../components/SubMenu';

const menuSections = [
  { text: 'Veterans Health Administration', href: 'https://www.va.gov/health' },
  {
    text: 'Veterans Benefits Administration',
    href: 'https://www.benefits.va.gov/benefits/',
  },
  { text: 'National Cemetery Administration', href: 'https://www.cem.va.gov/' },
  { text: 'VA Leadership', href: 'https://www.va.gov/opa/bios/index.asp' },
  { text: 'Public Affairs', href: 'https://www.va.gov/OPA/index.asp' },
  { text: 'Congressional Affairs', href: 'https://www.va.gov/oca/index.asp' },
  {
    text: 'All VA offices and organizations',
    href: 'https://www.va.gov/landing_organizations.htm',
  },
];

describe('Header <SubMenu>', () => {
  it('renders correctly with a sub menu and fires off updateSubMenu when toggled', () => {
    const subMenu = {
      id: 'sub-menu-id',
      menuSections,
    };

    const updateSubMenu = sinon.spy();
    const wrapper = shallow(
      <SubMenu subMenu={subMenu} updateSubMenu={updateSubMenu} />,
    );

    expect(wrapper.find('.header-menu-item-button')).to.have.length(1);
    expect(wrapper.find('.header-menu-item-button').text()).includes(
      'Back to menu',
    );
    expect(
      wrapper.find('li.vads-u-background-color--gray-lightest'),
    ).to.have.length(1);
    expect(
      wrapper.find('li.vads-u-background-color--primary-dark'),
    ).to.have.length(7);

    wrapper.find('.header-menu-item-button').simulate('click');

    expect(updateSubMenu.calledOnce).to.be.true;

    wrapper.unmount();
  });
});
