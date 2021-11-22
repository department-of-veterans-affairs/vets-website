// Node modules.
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Relative imports.
import { LogoRow } from '.';

describe('Header <LogoRow>', () => {
  it('renders correct content with no props', () => {
    // Set up.
    const wrapper = shallow(<LogoRow />);

    // Assertions.
    expect(wrapper.find('Logo')).to.have.length(1);
    expect(wrapper.find('Connect(Main)')).to.have.length(1);
    expect(wrapper.find('button.header-menu-button')).to.have.length(1);
    expect(wrapper.text()).includes('Menu');
    expect(wrapper.text()).not.includes('Close');
    expect(wrapper.find('i.fa.fa-bars')).to.have.length(1);
    expect(wrapper.find('i.fa.fa-times')).to.have.length(0);
    expect(wrapper.find('div.header-menu-button-overlay')).to.have.length(0);

    // Clean up.
    wrapper.unmount();
  });

  it('renders correct content with isMenuOpen', () => {
    // Set up tests.
    const wrapper = shallow(<LogoRow isMenuOpen />);

    // Assertions.
    expect(wrapper.find('Logo')).to.have.length(1);
    expect(wrapper.find('Connect(Main)')).to.have.length(1);
    expect(wrapper.find('button.header-menu-button')).to.have.length(1);
    expect(wrapper.text()).includes('Close');
    expect(wrapper.text()).not.includes('Menu');
    expect(wrapper.find('i.fa.fa-bars')).to.have.length(0);
    expect(wrapper.find('i.fa.fa-times')).to.have.length(1);
    expect(wrapper.find('div.header-menu-button-overlay')).to.have.length(1);

    // Clean up.
    wrapper.unmount();
  });

  it('toggles the menu', () => {
    // Set up tests.
    const updateExpandedMenuID = sinon.spy();
    const setIsMenuOpen = sinon.spy();
    const wrapper = shallow(
      <LogoRow
        isMenuOpen
        updateExpandedMenuID={updateExpandedMenuID}
        setIsMenuOpen={setIsMenuOpen}
      />,
    );
    wrapper.find('.header-menu-button').simulate('click');

    // Assertions.
    expect(updateExpandedMenuID.called).to.be.true;
    expect(setIsMenuOpen.called).to.be.true;
    expect(setIsMenuOpen.firstCall.args[0]).to.equal(false);

    // Clean up.
    wrapper.unmount();
  });
});
